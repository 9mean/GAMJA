const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

const imageErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.message === 'File too large')
      return res.status(httpStatus.BAD_REQUEST).json({ result: 500 });
    // 파일 사이즈 초과시,
    if (err.message === 'Extension Error')
      return res.status(httpStatus.BAD_REQUEST).json({ result: 501 });
    // 확장자 다를 시,
    return res.status(httpStatus.BAD_REQUEST).json({ result: 502 }); // 나머지 에러
  }
  return next();
};

module.exports = {
  errorConverter,
  errorHandler,
  imageErrorHandler,
};
