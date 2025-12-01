// usermodel.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false
  },
  firstname: {
    type: String,
    default: '',
  },
  lastname: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  country:String,
  profilePicture: String,
  coverPicture: String,
  about: String,
  livesin: String,
  worksAt: String,
  relationship: String,
  followers: [],
  following: []
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
