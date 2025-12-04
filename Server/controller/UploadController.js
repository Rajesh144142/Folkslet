const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { VALIDATION_MESSAGES } = require('../validation');
const uploadService = require('../services/uploadService');
const path = require('path');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.upload.fileRequired);
    }

    const sanitized = uploadService.sanitizeFileName(req.body.name, req.file.originalname);
    let publicId = path.parse(sanitized).name;
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER;

    publicId = uploadService.sanitizePublicId(publicId);

    const options = {
      public_id: publicId,
      resource_type: 'image',
      overwrite: true,
      use_filename: true,
      unique_filename: false,
    };

    if (folder) {
      const sanitizedFolder = uploadService.sanitizePublicId(folder);
      options.folder = sanitizedFolder;
    }

    const result = await uploadService.uploadToCloudinary(req.file.buffer, options);

    return sendSuccess(res, HTTP_STATUS.OK, {
      fileName: result.public_id,
      url: result.secure_url,
    }, VALIDATION_MESSAGES.success.fileUploaded);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const handleUploadError = (error, _req, res, _next) => {
  if (error instanceof require('multer').MulterError) {
    let message;
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = VALIDATION_MESSAGES.upload.fileTooLarge;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = VALIDATION_MESSAGES.upload.unsupportedFileType;
        break;
      default:
        message = VALIDATION_MESSAGES.upload.uploadFailed;
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, message);
  }
  return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, VALIDATION_MESSAGES.upload.uploadFailed);
};

module.exports = {
  uploadFile,
  handleUploadError,
};

