const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "62ec3b58a45370ee0f7dd5b9" // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use((req, res, next) => {
  req.card = {
    _id: "62ec518e8ade1375d48b713f"
  };

  next();
});

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.listen(PORT);
