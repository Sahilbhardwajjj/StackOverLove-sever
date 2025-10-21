const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello Welcome to the '/' end point!!");
});

app.get("/hello", (req, res) => {
  res.send("hello how are you!!");
});

app.get("/secret", (req, res) => {
  res.send("How do you find me ? Are you god ??");
});

app.listen(8080, () => {
  console.log("Server is listing on port 3000...");
});
