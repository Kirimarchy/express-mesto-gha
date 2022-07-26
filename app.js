const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { celebrate, Joi, errors } = require('celebrate');
const linkRule = require('./constants/link-rule');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRule),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(() => {
  throw new NotFoundError('Такого роута не существует');
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(err.statusCode).send({ message });

  next();
});

app.listen(PORT);
