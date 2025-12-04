const cloudinary = require('../config/cloudinary');
const path = require('path');
const logger = require('../utils/logger');

const sanitizeFileName = (value, originalName) => {
  const fallback = `${Date.now()}-${originalName}`;
  if (!value || typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed) {
    return fallback;
  }
  return path.basename(trimmed);
};

const sanitizePublicId = (publicId) => {
  if (!publicId || typeof publicId !== 'string') {
    return publicId;
  }
  return publicId
    .replace(/[^a-zA-Z0-9_\-/]/g, '-')
    .replace(/[-]+/g, '-')
    .replace(/^[-/]+|[-/]+$/g, '');
};

const uploadToCloudinary = (fileBuffer, options) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Promise.reject(new Error('Cloudinary is not configured'));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    stream.end(fileBuffer);
  });
};

module.exports = {
  sanitizeFileName,
  sanitizePublicId,
  uploadToCloudinary,
};

