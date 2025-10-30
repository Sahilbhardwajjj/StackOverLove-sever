const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Succesfully");
  } catch (err) {
    res.status(400).send("Error in saving the user Error:" + err.message);
  }
});

app.get("/findUser", async (req, res) => {
  let userEmail = req.body.email;
  try {
    let userFound = await User.find({ email: userEmail });
    if (userFound.length === 0) {
      res.status(404).send("User Not found");
    } else {
      res.send(userFound);
    }
  } catch (err) {
    res.status(500).send("Error while fetching the User");
  }
});

app.get("/feed", async (req, res) => {
  try {
    let user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("Users Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Error while fetching the Users");
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
