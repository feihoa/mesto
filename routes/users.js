const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  getUsers, getUser, updateUser, updateUserPic,
} = require('../controllers/users');

// get all users
router.get('/', getUsers);

// get user
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

// change name and about
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), updateUser);

// change avatar
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2),
  }),
}), updateUserPic);


module.exports = router;
