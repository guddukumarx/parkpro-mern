// middleware/audit.js
export const captureRequestMetadata = (req, res, next) => {
  req.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  req.userAgent = req.headers['user-agent'];
  next();
};