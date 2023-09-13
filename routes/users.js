const router = require('express').Router();
const { getCurrentUser, changeProfile } = require('../controllers/users');
const { validationChangeProfile } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validationChangeProfile, changeProfile);

module.exports = router;
