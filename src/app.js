const express = require("express");
const app = express();

app.get(
  "/user",
  (req, res) => {
    console.log("1st Route");
    next();
  },
  (req, res) => {
    console.log("2nd Route");
    next();
  },
  (req, res) => {
    console.log("3rd Route");
    res.send("3rd File");
  }
);

app.listen(3000, console.log("Server is listening to port 3000"));
