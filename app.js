require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');

const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { devUrl, limiter } = require('./utils/config');

const { PORT, DB_URL, NODE_ENV } = process.env;

const app = express();
app.use(cors({
  origin: ['http://localhost:3001', 'https://explore-movies.nomoredomainsicu.ru'],
  credentials: true,
}));

app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());
app.use(helmet());

app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect(NODE_ENV === 'production' ? DB_URL : devUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('БД подключена');
  }).catch(() => {
    console.log('Ошибка при подключении БД');
  });

app.listen(PORT);
