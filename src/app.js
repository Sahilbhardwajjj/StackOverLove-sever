const express = require("express");
const app = express();

const first = (req, res, next) => {
  console.log("I am First");
  next();
};

const second = (req, res, next) => {
  console.log("I am Second");
  next();
};

const third = (req, res, next) => {
  console.log("I am Third");
  res.send("I am 3rd");
};

app.get("/user", [first, second, third]);

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
