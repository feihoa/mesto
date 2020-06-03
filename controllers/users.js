const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');

const User = require('../models/user');


module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); });
    res.send({ data: user });
  } catch (err) {
    res.status(err.statusCode || 500).send({ message: err.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name, about, avatar, email: req.body.email, password: hash,
    });
    res.status(201).send({ data: user.omitPrivate() });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
    }
    res.status(err.statusCode || 500).send({ message: err.message });
  }
};


module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findById(req.user._id)
      .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); });
    if (req.user._id === user._id.toString()) {
      try {
        const userUpdated = await User.findByIdAndUpdate(req.user._id, { name, about },
          {
            new: true,
            runValidators: true,
          });
        res.status(200).send({ data: userUpdated });
      } catch (err) {
        if (err.name === 'ValidationError') {
          throw new ValidationError('Допущена ошибка при заполнении полей');
        } else {
          res.status(err.statusCode).send({ message: err.message });
        }
      }
    } else {
      throw new ForbiddenError('Доступ запрещен');
    }
  } catch (err) {
    res.status(err.statusCode || 500).send({ message: err.message });
  }
};

module.exports.updateUserPic = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user._id)
      .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); });

    if (req.user._id === user._id.toString()) {
      try {
        const userUpdated = await User.findByIdAndUpdate(req.user._id, { avatar },
          {
            new: true,
            runValidators: true,
          });
        res.status(200).send({ data: userUpdated });
      } catch (err) {
        if (err.name === 'ValidationError') {
          throw new ValidationError('Допущена ошибка при заполнении полей');
        }
      // else {
      //   res.status(500).send({ message: err.message });
      // }
      }
    } else {
      throw new ForbiddenError('Доступ запрещен');
    }
  } catch (err) {
    res.status(err.statusCode || 500).send({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'secret');
    res.status(201);
    res.cookie('jwt', token, {
      expire: '7d',
      httpOnly: true,
    })
      .send({ data: user.omitPrivate() });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};
