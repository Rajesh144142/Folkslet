const authenticateToken = require('./authMiddleware');

const globalAuthMiddleware = (req, res, next) => {
  const publicPaths = ['/auth', '/images'];
  const isPublicPath = publicPaths.some(publicPath => req.path.startsWith(publicPath));
  
  if (isPublicPath || req.path.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/i)) {
    return next();
  }
  
  return authenticateToken(req, res, next);
};

module.exports = globalAuthMiddleware;

