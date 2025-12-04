const { v2: cloudinary } = require('cloudinary');
const logger = require('../utils/logger');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else {
  logger.warn('Cloudinary credentials are not configured. File upload features will be disabled.');
}

module.exports = cloudinary;

