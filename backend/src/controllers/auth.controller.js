const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const env = require('../config/env');
const passport = require('../config/passport');

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const REFRESH_TOKEN_MAX_AGE_MS = (Number(env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000;

const getRequestMeta = (req) => ({
  userAgent: req.headers['user-agent'] || null,
  ipAddress: req.ip,
});

const buildRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  path: '/api/auth',
});

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, buildRefreshCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/api/auth' });
};

const buildResetUrl = (rawToken) => `${env.CLIENT_URL}/reset-password/${rawToken}`;

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.registerUser(
    { fullName, email, password },
    getRequestMeta(req)
  );

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { user, accessToken },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.loginUser(
    { email, password },
    getRequestMeta(req)
  );

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: { user, accessToken },
  });
});

const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  await authService.logoutUser(rawRefreshToken);
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  const { user, accessToken, refreshToken: newRefreshToken } = await authService.refreshSession(
    rawRefreshToken,
    getRequestMeta(req)
  );

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({
    success: true,
    message: 'Session refreshed successfully.',
    data: { user, accessToken },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email, buildResetUrl);

  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  await authService.resetPassword(token, password);

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully. Please log in with your new password.',
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current user retrieved successfully.',
    data: { user: req.user.toSafeObject() },
  });
});

const oauthCallback = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken: newRefreshToken } = await authService.issueTokenPair(
    req.user,
    getRequestMeta(req)
  );

  setRefreshTokenCookie(res, newRefreshToken);

  res.redirect(`${env.CLIENT_URL}/oauth/callback?accessToken=${accessToken}`);
});

/**
 * Builds an Express middleware that runs the given Passport strategy with
 * a custom callback, so authentication failures redirect the user back to
 * the frontend with an error message instead of hitting a bare API 404.
 * @param {string} strategyName - The registered Passport strategy name.
 */
const authenticateWithOAuth = (strategyName) => (req, res, next) => {
  passport.authenticate(strategyName, { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      const message = encodeURIComponent(
        (info && info.message) || 'Authentication failed. Please try again.'
      );
      return res.redirect(`${env.CLIENT_URL}/login?error=${message}`);
    }

    req.user = user;
    return oauthCallback(req, res, next);
  })(req, res, next);
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  oauthCallback,
  authenticateWithOAuth,
};
