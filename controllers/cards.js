const Card = require('../models/card');

const SomeWentWrongError = require('../errors/something-went-wrong-err');
const DefaultError = require('../errors/default-err');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/access-denied-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => {
      throw new SomeWentWrongError('Некорректные данные');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new SomeWentWrongError('Некорректные данные');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      // Проверка прав на удаление карточки
      if (req.user._id !== card.owner.toString()) {
        throw new AccessDeniedError('Вы не являетесь создателем данной карточки');
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then((deleteCard) => res.send(deleteCard));
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена' || err.message === 'Вы не являетесь создателем данной карточки') {
        return next(err);
      }
      if (err.name === 'CastError') {
        throw new SomeWentWrongError('Некорректный id');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Некорректный id');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Некорректный id') {
        return next(err);
      }
      if (err.name === 'CastError') {
        throw new SomeWentWrongError('Некорректный id');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new SomeWentWrongError('Некорректный id');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};
