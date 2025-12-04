const jwt = require('jsonwebtoken');
const appConfig = require('../config/appConfig');

const generateToken = (payload) => {
  if (!appConfig.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  return jwt.sign(payload, appConfig.jwtSecret, { expiresIn });
};

const verifyToken = (token) => {
  if (!appConfig.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.verify(token, appConfig.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
};

