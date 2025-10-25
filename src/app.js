const express = require("express");
const dbConnect = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    username: "onlySahil",
    firstName: "Sahil",
    email: "sahil123@gmail.com",
    password: "sahil#1234",
    role: "user",
  };

  // Creating a new instance of the User Model
  const user = new User(userObj);

  await user.save();
  res.send("User Added Succesfully");
});

dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is listening to port 3000");
    });
  })
  .catch((err) => {
    console.log("Database Cannot be Establisheds");
  });
