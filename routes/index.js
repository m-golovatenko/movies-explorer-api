const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError');

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use('*', () => {
  throw new NotFoundError('Страница по указанному маршруту не найдена.');
});

module.exports = router;
