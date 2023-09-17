// usermodel.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a unique username"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false
  },
 firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
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
