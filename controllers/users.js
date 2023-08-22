const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');
const UserAlreadyExistError = require('../errors/UserAlreadyExistError');
const AuthorizationError = require('../errors/AuthorizationError');
const { SUCCESS_CODE, SUCCESS_CREATE_CODE } = require('../utils/constants');

module.exports.getCurrentUser = (req, res, next) => {
  const currentUserId = req.user._id;

  User.findById(currentUserId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.status(SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Переданы некорректные данные при поиске пользователя.'));
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
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new WrongDataError('Переданы некорректные данные при изменении данных пользователя.'));
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
        next(new WrongDataError('Переданы некорректные данные при создании пользователя.'));
        return;
      }
      if (err.code === 11000) {
        next(new UserAlreadyExistError('Пользователь уже существует.'));
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
      next(new AuthorizationError('Такого пользователя не существует'));
      next(err);
    });
};
