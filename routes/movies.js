const router = require('express').Router();
const { getSavedMovies, createMovie, deleteSavedMovie } = require('../controllers/movies');
const { validationCreateMovie, validationMovieId } = require('../middlewares/validation');

router.get('/', getSavedMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationMovieId, deleteSavedMovie);

module.exports = router;
