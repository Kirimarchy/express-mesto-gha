const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const SomeWentWrongError = require('../errors/something-went-wrong-err');
const AuthError = require('../errors/auth-err');
const DefaultError = require('../errors/default-err');
const UsedEmailError = require('../errors/used-email-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      throw new SomeWentWrongError('Некорректный id');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        return next(err);
      }
      if (err.name === 'CastError') {
        throw new SomeWentWrongError('Некорректный id');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        return next(err);
      }
      if (err.name === 'CastError') {
        throw new SomeWentWrongError('Некорректный id');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    throw new AuthError('Некорректный email');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((newUser) => res.send(newUser))
      .catch((err) => {
        if (err.message === 'Некорректный email') {
          return next(err);
        }
        if (err.code === 11000) {
          throw new UsedEmailError('Email уже используется');
        }
        if (err.name === 'ValidationError') {
          throw new SomeWentWrongError('Некорректные данные');
        }
        throw new DefaultError('Произошла ошибка');
      })
      .catch(next));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new SomeWentWrongError('Некорректные данные');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new SomeWentWrongError('Некорректные данные');
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let saveUser = {};

  User.findOne({ email }).select('+password')
    .then((user) => {
      saveUser = user;
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        throw new AuthError('Неправильные почта или пароль');
      }

      // аутентификация успешна
      const token = jwt.sign({ _id: saveUser._id }, 'd285e3dceed844f902650f40', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
