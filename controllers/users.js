const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');


const User = require('../models/user');


const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); });
    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    if (password < 8) {
      throw new ValidationError('Длина пароля недостаточна');
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name, about, avatar, email, password: hash,
      });
      res.send({ data: user.omitPrivate() });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      } else if (err.name === 'MongoError') {
        throw new ConflictError('Такой e-mail уже существует');
      } else {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};


const updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    try {
      const userUpdated = await User.findByIdAndUpdate(req.user._id, { name, about },
        {
          new: true,
          runValidators: true,
        });
      res.send({ data: userUpdated });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      } else if (err.name === 'ForbiddenError') {
        throw new ForbiddenError('Доступ запрещен');
      } else {
        throw new Error();
      }
    }
  } catch (err) {
    next(err);
  }
};

const updateUserPic = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    try {
      const userUpdated = await User.findByIdAndUpdate(req.user._id, { avatar },
        {
          new: true,
          runValidators: true,
        });
      res.send({ data: userUpdated });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      } else if (err.name === 'ForbiddenError') {
        throw new ForbiddenError('Доступ запрещен');
      } else {
        throw new Error();
      }
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    res.status(201);
    res.cookie('jwt', token, {
      expire: '7d',
      httpOnly: true,
      sameSite: 'strict',
    })
      .send({ data: user.omitPrivate() });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers, getUser, login, updateUserPic, createUser, updateUser,
};
