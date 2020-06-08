/* eslint no-console: ["error", { allow: ["log"] }] */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');


const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

require('dotenv').config();

const { NODE_ENV = 'development' } = process.env;
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


app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
