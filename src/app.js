const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  let user = new User(req.body);
  try {
    let savedUser = await user.save();

    if (savedUser) {
      res.status(200).send("User Saved Successfully ");
    } else {
      res.status(404).send("User Not Saved");
    }
  } catch (err) {
    res.status(500).send("Something Went Wrong . Error : " + err.message);
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

app.get("/findUserWithID", async (req, res) => {
  try {
    let user = await User.findById({ _id: "68fcc7f1c8cf1c8cdd447a2d" });
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Something Went Wrong");
  }
});

app.delete("/deleteUserById", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: "68fcc7f1c8cf1c8cdd447a2d",
    });
    if (user) {
      res.send("User Deleted");
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.delete("/deleteByAnything", async (req, res) => {
  try {
    let user = await User.findOneAndDelete({ username: "onlyVishesh" });
    if (user) {
      res.send("User delete with specified filter");
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Something went Wrong");
  }
});

app.patch("/updateUsingPatch/:userID", async (req, res) => {
  let userID = req.params?.userID;
  let update = req.body;

  try {
    const ALLOWED_UPDATES = [
      "_id",
      "username",
      "firstName",
      "lastName",
      "password",
      "about",
      "skills",
      "role",
    ];

    const isUpdateAllowed = Object.keys(update).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    let user = await User.findOneAndUpdate({ _id: userID }, update, {
      runValidators: true,
      new: true,
    });
    if (user) {
      res.send("User Updated Successfully in the database");
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (err) {
    res.status(500).send(err.message);
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
