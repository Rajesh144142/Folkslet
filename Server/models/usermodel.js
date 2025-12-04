const mongoose = require('mongoose');
const { VALIDATION_MESSAGES } = require('../validation');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, VALIDATION_MESSAGES.required.email],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => emailRegex.test(v),
        message: VALIDATION_MESSAGES.format.email,
      },
      index: true,
    },
    password: {
      type: String,
      required: [true, VALIDATION_MESSAGES.required.password],
      minlength: [6, VALIDATION_MESSAGES.minlength.password],
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, VALIDATION_MESSAGES.maxlength.firstName],
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, VALIDATION_MESSAGES.maxlength.lastName],
      default: null,
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, VALIDATION_MESSAGES.maxlength.country],
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    coverPicture: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, VALIDATION_MESSAGES.maxlength.about],
      default: null,
    },
    livesIn: {
      type: String,
      trim: true,
      maxlength: [100, VALIDATION_MESSAGES.maxlength.livesIn],
      default: null,
    },
    worksAt: {
      type: String,
      trim: true,
      maxlength: [100, VALIDATION_MESSAGES.maxlength.worksAt],
      default: null,
    },
    relationship: {
      type: String,
      enum: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed', null],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.index({ email: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;
