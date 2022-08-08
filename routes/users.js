const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar
} = require("../controllers/users");

// GET /users — возвращает всех пользователей
router.get("/", getUsers); // +

// GET /users/:userId - возвращает пользователя по _id
router.get("/:userId", getUser); // +

// POST /users — создаёт пользователя
router.post("/", createUser); // +

// PATCH /users/me — обновляет профиль
router.patch("/me", updateProfile); // +

// PATCH /users/me/avatar — обновляет аватар
router.patch("/me/avatar", updateAvatar); // +

module.exports = router;
