const Movie = require('../models/movies');

const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');
const ValidError = require('../errors/valid');
const { ERROR_TYPE, ERROR_MESSAGE } = require('../constans/errors');

// Get all movies from server
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};
// Get all saved movies
module.exports.getSavedMovies = (req, res, next) => {
  Movie.findById(req.user._id)
    .then((savedMovies) => {
      res.send(savedMovies);
    })
    .catch(next);
};
// Create a new movie
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
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

// // Add movie in saved gallary
// module.exports.saveMovie = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.movieId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((movie) => {
//       if (!movie) {
//         throw new NotFoundError(ERROR_MESSAGE.notFound);
//       }
//       res.send(movie);
//     })
//     .catch(next);
// };
// // Remove movie from saved gallary
// module.exports.unsaveMovie = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.movieId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((movie) => {
//       if (!movie) {
//         throw new NotFoundError(ERROR_MESSAGE.notFound);
//       }
//       res.send(movie);
//     })
//     .catch(next);
// };
