const { ERROR_MESSAGE } = require('../constans/errors');

module.exports = ((err, req, res, next) => {
  // If error dont have statusCode that will be default 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // Check status
      message: statusCode === 500
        ? ERROR_MESSAGE.default
        : message,
    });
  next();
});
