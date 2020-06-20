const router = require('express').Router();

const { validateUserId, validateAvatar, validateMe } = require('../celebrateSchemas');

const {
  getUsers, getUser, updateUser, updateUserPic,
} = require('../controllers/users');


// get all users
router.get('/', getUsers);

// get user
router.get('/:userId', validateUserId, getUser);

// change name and about
router.patch('/me', validateMe, updateUser);

// change avatar
router.patch('/me/avatar', validateAvatar, updateUserPic);


module.exports = router;
