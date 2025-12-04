const { MIDDLEWARE_MESSAGES } = require('../validation');
const { HTTP_STATUS } = require('./httpStatus');

const getJWTError = (error) => {
  switch (error.name) {
    case 'TokenExpiredError':
      return {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MIDDLEWARE_MESSAGES.auth.tokenExpired,
      };
    case 'JsonWebTokenError':
      return {
        status: HTTP_STATUS.FORBIDDEN,
        message: MIDDLEWARE_MESSAGES.auth.tokenMalformed,
      };
    default:
      return {
        status: HTTP_STATUS.FORBIDDEN,
        message: MIDDLEWARE_MESSAGES.auth.invalidToken,
      };
  }
};

const getMongoError = (error) => {
  switch (error.name) {
    case 'ValidationError': {
      const errors = Object.values(error.errors).map((err) => err.message);
      return {
        status: HTTP_STATUS.BAD_REQUEST,
        message: errors.join(', '),
      };
    }
    case 'CastError':
      return {
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Invalid ID format',
      };
    default:
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return {
          status: HTTP_STATUS.CONFLICT,
          message: `${field} already exists`,
        };
      }
      return {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: MIDDLEWARE_MESSAGES.error.serverError,
      };
  }
};

const handleError = (error) => {
  switch (error.name) {
    case 'TokenExpiredError':
    case 'JsonWebTokenError':
      return getJWTError(error);
    case 'ValidationError':
    case 'CastError':
      return getMongoError(error);
    default:
      if (error.code === 11000) {
        return getMongoError(error);
      }
      return {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: error.message || MIDDLEWARE_MESSAGES.error.serverError,
      };
  }
};

module.exports = {
  getJWTError,
  getMongoError,
  handleError,
};
