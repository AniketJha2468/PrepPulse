const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, error.stack);
  }

  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
  };

  if (env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  console.error(`[Error] ${req.method} ${req.originalUrl} - ${error.message}`);

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
