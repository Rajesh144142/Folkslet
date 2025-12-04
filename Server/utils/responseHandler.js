const appConfig = require('../config/appConfig');

const sendSuccess = (res, status = 200, data = null, message = null) => {
  const response = {
    success: true,
  };

  if (data) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  return res.status(status).json(response);
};

const sendError = (res, status = 400, message, error = null) => {
  const response = {
    success: false,
    error: message,
  };

  if (error && appConfig.exposeErrorDetails) {
    response.details = error;
  }

  return res.status(status).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};

