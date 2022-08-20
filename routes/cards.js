const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const linkRule = require('../constants/link-rule');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// GET /cards — возвращает все карточки
router.get('/', getCards);

// POST /cards — создаёт карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().alphanum().required().min(2)
      .max(30),
    link: Joi.string().required().regex(linkRule),
  }),
}), createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().required(),
  }),
}), deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().required(),
  }),
}), likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().required(),
  }),
}), dislikeCard);

module.exports = router;
