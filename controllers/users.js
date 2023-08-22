const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');
const UserAlreadyExistError = require('../errors/UserAlreadyExistError');
const AuthorizationError = require('../errors/AuthorizationError');
const {
  SUCCESS_CODE,
  SUCCESS_CREATE_CODE,
  USER_NOT_FOUND,
  USER_SEARCH_WRONG_DATA,
  USER_CHANGE_WRONG_DATA,
  USER_CREATE_WRONG_DATA,
  USER_ALREADY_EXIST,
  USER_DOES_NOT_EXIST,
} = require('../utils/constants');

module.exports.getCurrentUser = (req, res, next) => {
  const currentUserId = req.user._id;

  User.findById(currentUserId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError(USER_SEARCH_WRONG_DATA));
        return;
      }

      next(err);
    });
};

module.exports.changeProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(USER_NOT_FOUND));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new WrongDataError(USER_CHANGE_WRONG_DATA));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(SUCCESS_CREATE_CODE).send({
      name: user.name, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError(USER_CREATE_WRONG_DATA));
        return;
      }
      if (err.code === 11000) {
        next(new UserAlreadyExistError(USER_ALREADY_EXIST));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(new AuthorizationError(USER_DOES_NOT_EXIST));
      next(err);
    });
};
