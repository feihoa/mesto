
const router = require('express').Router();

const fs = require('fs');

const path = require('path');

function readData() {
  return fs.promises.readFile(path.join(__dirname, '..', 'data', 'cards.json'), { encoding: 'utf8' })
    .then((data) => JSON.parse(data));
}

router.get('/', (req, res) => {
  readData().catch(() => { res.status(404).json({ message: 'Запрашиваемый файл не найден' }); }).then((cards) => res.json(cards));
});

module.exports = router;
