const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Statuses = require('./constants/statuses');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62ec3b58a45370ee0f7dd5b9', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(Statuses.notFound).send({ message: 'Здесь нужен ответ' });
});

app.listen(PORT);
