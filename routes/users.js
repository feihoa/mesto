/* eslint no-underscore-dangle: 0 */

const router = require('express').Router();

const users = require('../data/users.json');

router.get('/users', (req, res) => {
  res.send(users);
});


const userChecker = (req, res) => {
  const filterId = users.filter((item) => item._id === req.params.id);
  if (filterId.length !== 0) {
    res.send(filterId);
  } else {
    res.status(404);
    res.send({ message: 'Нет пользователя с таким id' });
  }
};


router.get('/users/:id', userChecker);


module.exports = router;
