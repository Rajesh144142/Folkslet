// const UserModel = require('../models/usermodel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// JWTKEY="your_secret_key_here"

// const signup = async (req, res) => {
//   const { username, password, lastname, firstname } = req.body;
//   console.log('Received signup request:', req.body);

//   try {
//     const existingUser = await UserModel.findOne({ username: username });
//     if (existingUser) {
//       console.log('User already exists:', existingUser);
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password using bcrypt
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(password, salt);

//     // Create a new user object with hashed password
//     const newUser = new UserModel({
//       username,
//       password: hashedPass,
//       lastname,
//       firstname,
//     });

//     // Save the new user to the database
//     await newUser.save();

//     console.log('New user saved:', newUser);

//     // Generate a JSON Web Token (JWT) for the user
//     const token = jwt.sign(
//       { username: newUser.username, id: newUser._id },
//       JWTKEY,
//       { expiresIn: '30d' } // Changed the expiration time to 30 days
//     );

//     res.status(201).json({
//       status: 'success',
//       token,
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };

// const signin = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await UserModel.findOne({ username: username });

//     if (!user) {
//       // User not found in the database
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const validity = await bcrypt.compare(password, user.password);

//     if (!validity) {
//       // Invalid password
//       return res.status(400).json({ message: 'Wrong password' });
//     }

//     // Password is correct, generate a JWT token
//     const token = jwt.sign(
//       { username: user.username, id: user._id },
//     JWTKEY,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({ user, token });
//   } catch (error) {
//     console.error('Error during signin:', error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };

// module.exports = { signup, signin };
const UserModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
JWTKEY = "your_secret_key_here"

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
      process.env.JWTKEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
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
          process.env.JWTKEY,
          { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
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
