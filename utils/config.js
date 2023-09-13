const rateLimit = require('express-rate-limit');

const devUrl = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  devUrl, limiter,
};
