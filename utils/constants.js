const SUCCESS_CODE = 200;
const SUCCESS_CREATE_CODE = 201;

const USER_NOT_FOUND = 'Пользователь с указанным _id не найден.';
const USER_SEARCH_WRONG_DATA = 'Переданы некорректные данные при поиске пользователя.';
const USER_CHANGE_WRONG_DATA = 'Переданы некорректные данные при изменении данных пользователя.';
const USER_CREATE_WRONG_DATA = 'Переданы некорректные данные при создании пользователя.';
const USER_ALREADY_EXIST = 'Пользователь уже существует.';
const USER_DOES_NOT_EXIST = 'Такого пользователя не существует.';
const MOVIE_CREATE_WRONG_DATA = 'Переданы некорректные данные при создании фильма.';
const MOVIE_NOT_FOUND = 'Фильм с указанным _id не найден.';
const FORBIDDEN_ERROR = 'Не ваш фильм.';
const MOVIE_DELETE_WRONG_DATA = 'Переданы некорректные данные фильма при удалении.';
const AUTHORIZATION_NEEDED = 'Необходима авторизация.';
const PAGE_NOT_FOUND = 'Страница по указанному маршруту не найдена.';

const regex = /^(https?:\/\/)?(www\.)?[A-Za-z0-9-[\].]+[A-Za-z0-9-[\]/]{2,}([A-Za-z0-9-._~:?#[\]@!$&'()*+,;=?%]*)?$/;

module.exports = {
  SUCCESS_CODE,
  SUCCESS_CREATE_CODE,
  regex,
  USER_NOT_FOUND,
  USER_SEARCH_WRONG_DATA,
  USER_CHANGE_WRONG_DATA,
  USER_CREATE_WRONG_DATA,
  USER_ALREADY_EXIST,
  USER_DOES_NOT_EXIST,
  MOVIE_CREATE_WRONG_DATA,
  MOVIE_NOT_FOUND,
  FORBIDDEN_ERROR,
  MOVIE_DELETE_WRONG_DATA,
  AUTHORIZATION_NEEDED,
  PAGE_NOT_FOUND,
};
