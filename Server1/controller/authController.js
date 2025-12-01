
const UserModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWTKEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
  throw new Error('JWTKEY environment variable is required');
}

// Register new user
const signup = async (req, res) => {
  const { email, username } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase();
    const existingEmail = await UserModel.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const baseUsername = (username || normalizedEmail.split('@')[0] || '').toLowerCase().replace(/[^a-z0-9_]+/g, '');
    let finalUsername = baseUsername || `user${Date.now()}`;
    let counter = 1;
    while (await UserModel.exists({ username: finalUsername })) {
      finalUsername = `${baseUsername || 'user'}${counter}`;
      counter += 1;
    }

    const newUser = new UserModel({
      ...req.body,
      email: normalizedEmail,
      username: finalUsername,
    });

    const user = await newUser.save();
    const token = jwt.sign(
      { email: user.email, username: user.username, id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

// Changed
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        return res.status(400).json({ message: 'Wrong password' });
      } else {
        const token = jwt.sign(
          { email: user.email, username: user.username, id: user._id },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        res.status(200).json({ user, token });
      }
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { signup, signin };
