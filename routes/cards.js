const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// GET /cards — возвращает все карточки
router.get('/', getCards); // +

// POST /cards — создаёт карточку
router.post('/', createCard); // +

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/:cardId', deleteCard); // +

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/:cardId/likes', likeCard); // +

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/:cardId/likes', dislikeCard); // +

module.exports = router;
