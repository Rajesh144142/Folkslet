const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false
  },
  firstname: {
    type: String,
    required: false
  },
  lastname: {
    type: String,
    required: false
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
