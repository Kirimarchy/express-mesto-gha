const User = require("../models/user");
import { statuses } from  "../constants/statuses";
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(statuses.defaultError).send({ message: "Ошибка по умолчанию" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then(user => res.send(user))
    .catch(() =>
    if (err.name === 'CastError') {
      res.status(statuses.badRequest).send({ message: 'Некорректный id'});
    } else {
      res.status(statuses.defaultError).send({ message: 'Произошла ошибка' });
    }
    );
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(newUser => res.send(newUser))
    .catch(() =>
    if (err.name === 'ValidationError') {
      res.status(statuses.badRequest).send({ message: 'Некорректные данные'});
      } else {
        res.status(statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    );
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about },  { new: true, runValidators: true })
    .then(newUser => res.send(newUser))
    .catch(() =>
     if (err.name === 'ValidationError') {
      res.status(statuses.badRequest).send({ message: 'Некорректные данные' });
      } else {
        res.status(statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    );
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(newUser => res.send(newUser))
    .catch(() =>
    if (err.name === 'ValidationError') {
      res.status(statuses.badRequest).send({ message: 'Некорректные данные'});
      } else {
        res.status(statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    );
};
