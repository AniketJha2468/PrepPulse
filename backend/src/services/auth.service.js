const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const {
  generateAccessToken,
  generateSecureToken,
  hashToken,
} = require('../utils/token.util');
const { sendPasswordResetEmail } = require('../utils/email.util');
const { AUTH_PROVIDERS } = require('../constants/authProviders.constants');
const { ACCOUNT_STATUS } = require('../constants/accountStatus.constants');

const REFRESH_TOKEN_EXPIRES_IN_DAYS = Number(env.JWT_COOKIE_EXPIRES_IN) || 7;

/**
 * Issues a new access/refresh token pair for a user and persists the
 * hashed refresh token so it can later be verified, rotated, or revoked.
 * @param {import('mongoose').Document} user - The authenticated user document.
 * @param {Object} [meta] - Request metadata for auditing.
 * @returns {Promise<{ accessToken: string, refreshToken: string, refreshTokenExpiresAt: Date }>}
 */
const issueTokenPair = async (user, meta = {}) => {
  const accessToken = generateAccessToken({ sub: user._id.toString(), role: user.role });

  const rawRefreshToken = generateSecureToken();
  const refreshTokenExpiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
  );

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(rawRefreshToken),
    expiresAt: refreshTokenExpiresAt,
    userAgent: meta.userAgent || null,
    ipAddress: meta.ipAddress || null,
  });

  return { accessToken, refreshToken: rawRefreshToken, refreshTokenExpiresAt };
};

/**
 * Registers a new local user account and issues an initial session.
 */
const registerUser = async ({ fullName, email, password }, meta = {}) => {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    authProvider: AUTH_PROVIDERS.LOCAL,
  });

  const tokens = await issueTokenPair(user, meta);

  return { user: user.toSafeObject(), ...tokens };
};

/**
 * Authenticates a local user by email and password and issues a new session.
 */
const loginUser = async ({ email, password }, meta = {}) => {
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || user.authProvider !== AUTH_PROVIDERS.LOCAL) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
    throw new ApiError(403, 'This account is not active. Please contact support.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateModifiedOnly: true });

  const tokens = await issueTokenPair(user, meta);

  return { user: user.toSafeObject(), ...tokens };
};

/**
 * Rotates a refresh token: verifies the presented raw token against its
 * stored hash, revokes it, and issues a brand-new access/refresh pair.
 */
const refreshSession = async (rawRefreshToken, meta = {}) => {
  if (!rawRefreshToken) {
    throw new ApiError(401, 'Refresh token is required.');
  }

  const tokenHash = hashToken(rawRefreshToken);
  const storedToken = await RefreshToken.findOne({ tokenHash }).select('+tokenHash');

  if (!storedToken || !storedToken.isActive()) {
    throw new ApiError(401, 'Invalid or expired refresh token. Please log in again.');
  }

  const user = await User.findById(storedToken.user);
  if (!user || user.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
    throw new ApiError(401, 'Invalid session. Please log in again.');
  }

  const tokens = await issueTokenPair(user, meta);

  storedToken.revoke(hashToken(tokens.refreshToken));
  await storedToken.save();

  return { user: user.toSafeObject(), ...tokens };
};

/**
 * Revokes a refresh token, effectively logging the user out of that session.
 */
const logoutUser = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    return;
  }

  const tokenHash = hashToken(rawRefreshToken);
  const storedToken = await RefreshToken.findOne({ tokenHash }).select('+tokenHash');

  if (storedToken && storedToken.isActive()) {
    storedToken.revoke();
    await storedToken.save();
  }
};

/**
 * Generates and emails a password reset link for the given email address.
 * Always resolves successfully (even if the email is unknown) to avoid
 * leaking which addresses have an account.
 */
const forgotPassword = async (email, buildResetUrl) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail, authProvider: AUTH_PROVIDERS.LOCAL });

  if (!user) {
    return;
  }

  const rawToken = user.generatePasswordResetToken(env.RESET_PASSWORD_EXPIRES_MINUTES);
  await user.save({ validateModifiedOnly: true });

  try {
    await sendPasswordResetEmail({
      to: user.email,
      fullName: user.fullName,
      resetUrl: buildResetUrl(rawToken),
      expiresInMinutes: env.RESET_PASSWORD_EXPIRES_MINUTES,
    });
  } catch (error) {
    user.clearPasswordResetToken();
    await user.save({ validateModifiedOnly: true });
    throw new ApiError(500, 'Failed to send password reset email. Please try again later.');
  }
};

/**
 * Resets a user's password using a previously issued raw reset token,
 * then revokes all of that user's active refresh tokens for security.
 */
const resetPassword = async (rawToken, newPassword) => {
  const tokenHash = hashToken(rawToken);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetTokenHash +passwordResetExpires');

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired.');
  }

  user.password = newPassword;
  user.clearPasswordResetToken();
  await user.save();

  await RefreshToken.updateMany(
    { user: user._id, isRevoked: false },
    { $set: { isRevoked: true, revokedAt: new Date() } }
  );
};

module.exports = {
  issueTokenPair,
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  forgotPassword,
  resetPassword,
};
