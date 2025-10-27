const express = require("express");
const dbConnect = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    username: "onlyRiya",
    firstName: "Riya",
    email: "riya123@gmail.com",
    password: "ria#1234",
    role: "admin",
  };

  // Creating a new instance of the User Model
  const user = new User(userObj);

  try {
    await user.save();
    res.send("User Added Succesfully");
  } catch (err) {
    res.status(400).send("Error in saving the user Error:" + err.message);
  }
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
