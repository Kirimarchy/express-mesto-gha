const User = require('../models/user');
const Statuses = require('../constants/statuses');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(Statuses.defaultError).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(Statuses.notFound).send({ message: 'Некорректный id' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректный id' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректные данные' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректные данные' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректные данные' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};
