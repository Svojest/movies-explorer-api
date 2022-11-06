const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const ValidError = require('../errors/valid');
const NotFoundError = require('../errors/notFound');
const ConflictError = require('../errors/conflict');
const { ERROR_TYPE, ERROR_MESSAGE } = require('../constans/errors');

// Registration user
module.exports.createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, password: hash,
    }))
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(ERROR_MESSAGE.userExists));
      }
      if (err.name === ERROR_TYPE.valid) {
        return next(new ValidError(ERROR_MESSAGE.valid));
      }
      return next(err);
    });
};
// Authorization user
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log('Я дошел до и сюда тоже');
      // Create token
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },

      );
      res.send({ token }).end();
    })
    .catch(next);
};
// Get current info user
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE.notFound);
      }
      res.send(user);
    })
    .catch(next);
};
// Update user info (email, name)
module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE.notFound);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.valid || err.name === ERROR_TYPE.cast) {
        return next(new ValidError(ERROR_MESSAGE.notFound));
      }
      return next(err);
    });
};
