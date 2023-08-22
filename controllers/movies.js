const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  SUCCESS_CODE, SUCCESS_CREATE_CODE, MOVIE_CREATE_WRONG_DATA, MOVIE_NOT_FOUND, FORBIDDEN_ERROR, MOVIE_DELETE_WRONG_DATA,
} = require('../utils/constants');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(SUCCESS_CODE).send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner,
  })
    .then((movie) => res.status(SUCCESS_CREATE_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError(MOVIE_CREATE_WRONG_DATA));
        return;
      }
      next(err);
    });
};

module.exports.deleteSavedMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError(MOVIE_NOT_FOUND);
    })
    .then((movie) => {
      if (String(movie.owner) === String(owner)) {
        Movie.deleteOne(movie)
          .then(() => res.status(SUCCESS_CODE).send(movie))
          .catch(next);
      } else {
        throw new ForbiddenError(FORBIDDEN_ERROR);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError(MOVIE_DELETE_WRONG_DATA));
        return;
      }
      next(err);
    });
};
