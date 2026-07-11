const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyAccessToken } = require('../utils/token.util');
const { ACCOUNT_STATUS } = require('../constants/accountStatus.constants');

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    throw new ApiError(401, 'Authentication required. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired session. Please log in again.');
  }

  const user = await User.findById(decoded.sub).select('+passwordChangedAt');

  if (!user) {
    throw new ApiError(401, 'The user belonging to this session no longer exists.');
  }

  if (user.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
    throw new ApiError(403, 'This account is not active. Please contact support.');
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    throw new ApiError(401, 'Password was recently changed. Please log in again.');
  }

  req.user = user;
  next();
});

/**
 * Restricts access to users whose role is included in the allowed list.
 * Must be used after the authenticate middleware.
 * @param {...string} allowedRoles - Roles permitted to access the route.
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  return next();
};

module.exports = {
  authenticate,
  authorize,
};
