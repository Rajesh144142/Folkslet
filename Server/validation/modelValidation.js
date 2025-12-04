const VALIDATION_MESSAGES = {
  required: {
    email: 'Please enter your email address',
    password: 'Please enter your password',
    postId: 'Post information is missing',
    userId: 'User information is missing',
    chatId: 'Chat information is missing',
    senderId: 'Sender information is missing',
    text: 'Please enter some text',
    comment: 'Please enter your comment',
    windowStart: 'Start date is required',
    windowEnd: 'End date is required',
    topic: 'Please enter a topic',
  },

  format: {
    email: 'Please enter a valid email address',
  },

  minlength: {
    password: 'Password must be at least 6 characters long',
  },

  maxlength: {
    firstName: 'First name is too long (maximum 50 characters)',
    lastName: 'Last name is too long (maximum 50 characters)',
    country: 'Country name is too long (maximum 100 characters)',
    about: 'About section is too long (maximum 500 characters)',
    livesIn: 'Location is too long (maximum 100 characters)',
    worksAt: 'Work place is too long (maximum 100 characters)',
    description: 'Description is too long (maximum 2000 characters)',
    address: 'Address is too long (maximum 200 characters)',
    comment: 'Comment is too long (maximum 1000 characters)',
    message: 'Message is too long (maximum 5000 characters)',
    topic: 'Topic is too long (maximum 200 characters)',
    summary: 'Summary is too long (maximum 500 characters)',
  },

  range: {
    latitude: 'Invalid latitude. Please enter a value between -90 and 90',
    longitude: 'Invalid longitude. Please enter a value between -180 and 180',
  },

  min: {
    shareCount: 'Share count cannot be negative',
    score: 'Score cannot be negative',
  },


  conflict: {
    emailExists: 'Email already exists',
  },

  notFound: {
    user: 'User not found',
    post: 'Post not found',
    notification: 'Notification not found',
    chat: 'Chat not found',
  },

  validation: {
    chatMembers: 'A chat must have exactly 2 members',
    messageContent: 'Please enter a message or attach a file',
    followSelf: 'You cannot follow yourself',
    trendWindow: 'Start date must be before end date',
    postOwnership: 'You can only modify your own posts',
    invalidPayload: 'Invalid request data',
    userOwnership: 'You can only modify your own profile',
    alreadyFollowing: 'You are already following this user',
    notFollowing: 'You are not following this user',
    chatWithSelf: 'Cannot create a chat with yourself',
  },

  auth: {
    invalidCredentials: 'Invalid email or password',
  },

  success: {
    userDeleted: 'User deleted successfully',
    userFollowed: 'User followed successfully',
    userUnfollowed: 'User unfollowed successfully',
    fileUploaded: 'File uploaded successfully',
  },

  upload: {
    fileRequired: 'Please select a file to upload',
    fileTooLarge: 'File is too large. Please select a smaller file',
    unsupportedFileType: 'Unsupported file type. Please upload an image file',
    uploadFailed: 'File upload failed. Please try again',
  },
};

const getMaxLengthMessage = (field) => {
  return VALIDATION_MESSAGES.maxlength[field] || `${field} is too long`;
};

const getRequiredMessage = (field) => {
  return VALIDATION_MESSAGES.required[field] || `Please enter ${field}`;
};

module.exports = {
  VALIDATION_MESSAGES,
  getMaxLengthMessage,
  getRequiredMessage,
};
