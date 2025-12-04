require('dotenv').config();
const { connectDatabase } = require('../db');
const { hashPassword } = require('../utils/passwordUtils');
const UserModel = require('../models/usermodel');
const PostModel = require('../models/postModel');
const logger = require('../utils/logger');

const PASSWORD = 'password123';
const NUM_USERS = 10;
const POSTS_PER_USER = 5;

const sampleDescriptions = [
  'Just had an amazing day exploring the city!',
  'Beautiful sunset today 🌅',
  'Working on some exciting new projects',
  'Coffee and code - perfect combination',
  'Weekend vibes are here!',
  'Learning something new every day',
  'Great time with friends today',
  'Nature is truly amazing',
  'Productive day at work',
  'Enjoying the little moments',
  'New adventures await',
  'Life is beautiful',
  'Making progress step by step',
  'Grateful for today',
  'Chasing dreams and goals',
];

const generateUserData = (index) => {
  const firstName = `User${index + 1}`;
  const lastName = `Test${index + 1}`;
  return {
    email: `user${index + 1}@test.com`,
    firstName,
    lastName,
    country: 'United States',
    about: `This is a test user ${index + 1}`,
    livesIn: 'New York',
    worksAt: 'Tech Company',
    relationship: 'Single',
  };
};

const generatePostData = (userId, index) => {
  const descIndex = (index * userId.toString().length) % sampleDescriptions.length;
  return {
    userId,
    desc: sampleDescriptions[descIndex],
    image: null,
    location: null,
  };
};

const seedUsersAndPosts = async () => {
  try {
    await connectDatabase();
    logger.info('Starting seed script...');

    const hashedPassword = await hashPassword(PASSWORD);
    const createdUsers = [];

    for (let i = 0; i < NUM_USERS; i++) {
      const userData = generateUserData(i);
      const existingUser = await UserModel.findOne({ email: userData.email });

      if (existingUser) {
        logger.info(`User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
        continue;
      }

      const newUser = new UserModel({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
      logger.info(`Created user: ${savedUser.email}`);
    }

    logger.info(`Created ${createdUsers.length} users`);

    let totalPostsCreated = 0;

    for (const user of createdUsers) {
      for (let i = 0; i < POSTS_PER_USER; i++) {
        const postData = generatePostData(user._id, i);
        const newPost = new PostModel(postData);
        await newPost.save();
        totalPostsCreated++;
      }
      logger.info(`Created ${POSTS_PER_USER} posts for user: ${user.email}`);
    }

    logger.info(`Seed script completed successfully!`);
    logger.info(`Total users: ${createdUsers.length}`);
    logger.info(`Total posts created: ${totalPostsCreated}`);
    logger.info(`All users have password: ${PASSWORD}`);

    process.exit(0);
  } catch (error) {
    logger.error('Seed script failed:', error);
    process.exit(1);
  }
};

seedUsersAndPosts();

