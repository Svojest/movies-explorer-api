const Movie = require('../models/movies');

const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');
const ValidError = require('../errors/valid');
const { ERROR_TYPE, ERROR_MESSAGE } = require('../constans/errors');

// Get all saved movies current user
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

// Create a new movie
module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === ERROR_TYPE.valid) {
        next(new ValidError(ERROR_MESSAGE.valid));
      } else {
        next(err);
      }
    });
};

// Delete a movie
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERROR_MESSAGE.notFound);
      }
      const isOwn = movie.owner._id.equals(req.user._id);
      if (!isOwn) {
        throw new ForbiddenError(ERROR_MESSAGE.forbidden);
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
    })
    .catch(next);
};
