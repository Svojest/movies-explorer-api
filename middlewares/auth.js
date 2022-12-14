const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth');
const { ERROR_MESSAGE } = require('../constans/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(ERROR_MESSAGE.needAuth);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  }
  catch (err) {
    next(new AuthError(ERROR_MESSAGE.badToken));
  }
  req.user = payload;
  next();
};
