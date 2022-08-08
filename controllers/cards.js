const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then(cards => res.send(cards))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }));
};

module.exports.createCard = (req, res) => {
  const { name, link, ownerId, likesId, createdAt } = req.body;

  Card.create({ name, link, owner: req.user._id, likes: likesId, createdAt })
    .then(card => res.send(card))
    .catch(() =>
      res.status(500).send({ message: "Отсутствуют обязательные параметры" })
    )
    .catch(() =>
      res
        .status(400)
        .send({ message: "Переданы некорректные данные при создании карточки" })
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.card._id)
    .then(card => res.send(card))
    .catch(() =>
      res.status(404).send({ message: "Карточка с указанным _id не найдена" })
    );
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.card._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then(newCard => res.send(newCard))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }))
    .catch(() =>
      res.status(404).send({ message: "Передан несуществующий _id карточки" })
    )
    .catch(() =>
      res
        .status(400)
        .send({ message: "Переданы некорректные данные для постановки" })
    );
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.card._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then(newCard => res.send(newCard))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }))
    .catch(() =>
      res.status(404).send({ message: "Передан несуществующий _id карточки" })
    )
    .catch(() =>
      res
        .status(400)
        .send({ message: "Переданы некорректные данные для снятии лайка" })
    );
};
