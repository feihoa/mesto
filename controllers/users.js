const User = require('../models/user');


module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users !== null) {
        res.send({ data: users });
      } else {
        res.status(404).send({ message: 'Not found' });
      }
    })
    .catch(() => res.status(404).send({ message: 'Not found' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Not found' });
      }
    })
    .catch(() => res.status(404).send({ message: 'Not found' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send(err.message));
};


module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true,
    })

    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.updateUserPic = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true,
    })

    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send(err.message));
};
