const Card = require('../models/card');
const Statuses = require('../constants/statuses');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(Statuses.defaultError).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, likesId, createdAt,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id, likes: likesId, createdAt,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректные данные' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.card._id)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректный id' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.card._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректный id' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.card._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Statuses.badRequest).send({ message: 'Некорректный id' });
      } else {
        res.status(Statuses.defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};
