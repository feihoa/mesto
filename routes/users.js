
const router = require('express').Router();

const {
  getUsers, getUser, createUser, updateUser, updateUserPic,
} = require('../controllers/users');


router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserPic);


module.exports = router;
