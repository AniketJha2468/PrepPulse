const { validationResult } = require('express-validator');

const ApiError = require('../utils/ApiError');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  return res.status(422).json({
    success: false,
    message: "Validation failed",
    errors: formattedErrors,
  });

  return next(validationError);
};

module.exports = validateRequest;
