const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError');
const { PAGE_NOT_FOUND } = require('../utils/constants');

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use('*', () => {
  throw new NotFoundError(PAGE_NOT_FOUND);
});

module.exports = router;
