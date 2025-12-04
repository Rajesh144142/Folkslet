const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const appConfig = {
  env: process.env.NODE_ENV ,
  isDevelopment,
  isProduction,
  exposeErrorDetails: isDevelopment,
  jwtSecret: process.env.JWTKEY,
  port: process.env.PORT ,
};

module.exports = appConfig;

