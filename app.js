/* eslint no-console: ["error", { allow: ["log"] }] */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { celebrate, Joi, isCelebrate } = require('celebrate');


const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { requestLogger, errorLogger } = require('./middlewares/Logger');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

require('dotenv').config();

const { NODE_ENV = 'production' } = process.env;
console.log(NODE_ENV);

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,

});

app.use(requestLogger);

// log in
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
}), login);

// create user
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().min(5),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
}), createUser);

app.use(auth);

app.use('/users', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), usersRouter);

app.use('/cards', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), cardsRouter);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);


app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (isCelebrate(err)) {
    res
      .status(400)
      .send({
        message: err.message,
      });
  } else {
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }
  next();
});

module.exports = app;
