const express = require('express');
<<<<<<< Updated upstream
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});

=======
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

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

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']);

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

const uploadToCloudinary = (fileBuffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    stream.end(fileBuffer);
  });

router.post('/', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File upload failed' });
  }

  try {
    const sanitized = sanitizeFileName(req.body.name, req.file.originalname);
    const publicId = path.parse(sanitized).name;
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER;
    const options = {
      public_id: publicId,
      resource_type: 'image',
      overwrite: true,
      use_filename: true,
      unique_filename: false,
    };
    if (folder) {
      options.folder = folder;
    }
    const result = await uploadToCloudinary(req.file.buffer, options);

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileName: result.public_id,
      url: result.secure_url,
    });
  } catch (error) {
    return next(error);
  }
});

router.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large'
        : error.code === 'LIMIT_UNEXPECTED_FILE'
        ? 'Unsupported file type'
        : 'Upload failed';
    return res.status(400).json({ success: false, message });
  }
  return res.status(500).json({ success: false, message: 'Upload failed' });
});

>>>>>>> Stashed changes
module.exports = router;
