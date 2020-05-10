/* eslint no-underscore-dangle: 0 */

const router = require('express').Router();

const fs = require('fs');

const path = require('path');


function readData() {
  return fs.promises.readFile(path.join(__dirname, '..', 'data', 'users.json'), { encoding: 'utf8' })
    .then((data) => JSON.parse(data));
}

router.get('/', (req, res) => {
  readData().catch(() => { res.status(404).json({ message: 'Запрашиваемый файл не найден' }); }).then((users) => res.json(users));
});


const userChecker = (req, res) => {
  readData()
    .catch(() => { res.status(404).json({ message: 'Запрашиваемый файл не найден' }); })
    .then((users) => {
      const user = users.find((item) => item._id === req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Нет пользователя с таким id' });
      }
    });
};


router.get('/:id', userChecker);

module.exports = router;
