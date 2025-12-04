const UserModel = require('../models/usermodel');

const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

const findUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await UserModel.findOne({ email: normalizedEmail }).select('+password');
  return user;
};

const checkEmailExists = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await UserModel.findOne({ email: normalizedEmail });
  return { exists: !!existingUser, user: existingUser };
};

const createUser = async (userData) => {
  const normalizedEmail = normalizeEmail(userData.email);
  const newUser = new UserModel({
    ...userData,
    email: normalizedEmail,
  });
  const user = await newUser.save();
  return user;
};

module.exports = {
  normalizeEmail,
  findUserByEmail,
  checkEmailExists,
  createUser,
};
