const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { VALIDATION_MESSAGES } = require('../validation');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const {
  checkEmailExists,
  createUser,
  findUserByEmail,
} = require('../services/authService');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.email);
    }

    if (!password) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.password);
    }

    const { exists } = await checkEmailExists(email);

    if (exists) {
      return sendError(res, HTTP_STATUS.CONFLICT, VALIDATION_MESSAGES.conflict.emailExists);
    }

    const hashedPassword = await hashPassword(password);
    const userData = {
      ...req.body,
      password: hashedPassword,
      profilePicture: req.body.profilePicture || null,
      coverPicture: req.body.coverPicture || null,
    };

    const user = await createUser(userData);
    const token = generateToken({ email: user.email, id: user._id });

    return sendSuccess(res, HTTP_STATUS.CREATED, {
      user,
      token,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.email);
    }

    if (!password) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.password);
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.user);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.auth.invalidCredentials);
    }

    const token = generateToken({ email: user.email, id: user._id });

    return sendSuccess(res, HTTP_STATUS.OK, {
      user,
      token,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

module.exports = {
  signup,
  signin,
};
