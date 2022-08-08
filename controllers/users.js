const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then(user => res.send(user))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }))
    .catch(() =>
      res
        .status(404)
        .send({ message: "Пользователь с указанным _id не найден" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(newUser => res.send(newUser))
    .catch(() =>
      res.status(500).send({ message: "Отсутствуют обязательные параметры" })
    )
    .catch(() =>
      res.status(400).send({
        message: "Переданы некорректные данные при создании пользователя"
      })
    );
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then(newUser => res.send(newUser))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }))
    .catch(() =>
      res
        .status(404)
        .send({ message: "Пользователь с указанным _id не найден" })
    )
    .catch(() =>
      res.status(400).send({
        message: "Переданы некорректные данные при обновлении профиля"
      })
    );
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(newUser => res.send(newUser))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }))
    .catch(() =>
      res
        .status(404)
        .send({ message: "Пользователь с указанным _id не найден" })
    )
    .catch(() =>
      res.status(400).send({
        message: "Переданы некорректные данные при обновлении профиля"
      })
    );
};
