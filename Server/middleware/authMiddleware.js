const jwt = require('jsonwebtoken');
const { MIDDLEWARE_MESSAGES } = require('../validation');
const { sendError } = require('../utils/responseHandler');
const { getJWTError } = require('../utils/errorHandler');
const appConfig = require('../config/appConfig');

const extractToken = (authHeader) => {
  if (!authHeader) {
    return { token: null, error: MIDDLEWARE_MESSAGES.auth.missingHeader };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return { token: null, error: MIDDLEWARE_MESSAGES.auth.invalidFormat };
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return { token: null, error: MIDDLEWARE_MESSAGES.auth.missingToken };
  }

  return { token, error: null };
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!appConfig.jwtSecret) {
      return reject(new Error(MIDDLEWARE_MESSAGES.error.serverError));
    }

    jwt.verify(token, appConfig.jwtSecret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const { token, error: tokenError } = extractToken(authHeader);
  if (tokenError) {
    return sendError(res, 401, tokenError);
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const { status, message } = getJWTError(error);
    return sendError(res, status, message);
  }
};

const optionalAuthenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const { token } = extractToken(authHeader);

  if (token) {
    try {
      const decoded = await verifyToken(token);
      req.user = decoded;
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

module.exports = authenticateToken;
module.exports.optionalAuthenticateToken = optionalAuthenticateToken;
