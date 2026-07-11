/**
 * Wraps an async Express route/controller handler so that any rejected
 * promise is forwarded to the centralized error-handling middleware
 * instead of requiring a try/catch block in every handler.
 * @param {Function} handler - An async (req, res, next) => {} function.
 * @returns {Function} An Express-compatible middleware function.
 */
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
