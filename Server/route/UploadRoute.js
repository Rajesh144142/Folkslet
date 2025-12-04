const express = require('express');
const multer = require('multer');
const { ALLOWED_IMAGE_MIME_TYPES } = require('../config/constants');
const { uploadFile, handleUploadError } = require('../controller/UploadController');

const router = express.Router();

const allowedMimeTypes = new Set(ALLOWED_IMAGE_MIME_TYPES);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE || 10 * 1024 * 1024),
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'file'));
    }
    return cb(null, true);
  },
});

router.post('/', upload.single('file'), uploadFile);
router.use(handleUploadError);

module.exports = router;
