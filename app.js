require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const limiter = require('./middlewares/rate-limit');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, DB_URL } = process.env;

const app = express();

app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());
app.use(helmet());

app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('БД подключена');
  }).catch(() => {
    console.log('Ошибка при подключении БД');
  });

app.listen(PORT);
