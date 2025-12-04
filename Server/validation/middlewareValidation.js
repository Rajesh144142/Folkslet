const MIDDLEWARE_MESSAGES = {
  auth: {
    missingHeader: 'Please sign in to continue',
    invalidFormat: 'Authentication failed. Please sign in again',
    missingToken: 'Authentication token is missing. Please sign in',
    invalidToken: 'Your session has expired. Please sign in again',
    tokenExpired: 'Your session has expired. Please sign in again',
    tokenMalformed: 'Invalid authentication. Please sign in again',
    unauthorized: 'You need to sign in to access this',
    forbidden: 'You do not have permission to access this',
  },
  error: {
    serverError: 'Something went wrong. Please try again later',
    badRequest: 'Invalid request. Please check your input',
    notFound: 'The requested resource was not found',
  },
};

module.exports = {
  MIDDLEWARE_MESSAGES,
};
