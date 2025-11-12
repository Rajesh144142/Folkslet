const mongoose = require('mongoose');

const connectDatabase = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = {
  connectDatabase,
};
