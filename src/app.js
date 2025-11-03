const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const userAuth = require("./middlewares/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { username, firstName, email, password, role, bio, skills, age } =
    req.body;
  try {
    // Validate SignUp Data
    validateSignUpData(req);

    //Password Encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    //Creating a new Instance of the User
    let user = new User({
      username,
      firstName,
      email,
      password: hashedPassword,
      role,
      bio,
      skills,
      age,
    });

    //Saving the user
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate the email
    const ValidatedEmail = (value) => {
      return validator.isEmail(value);
    };
    if (!ValidatedEmail(email)) {
      throw new Error("Enter a Valid Email Address");
    }

    // Email is present in the database
    const userPresent = await User.findOne({ email: email });
    if (!userPresent) {
      throw new Error("You are not signedUp.");
    }

    // Password matches with password stored in the database
    const PasswordCorrect = await bcrypt.compare(
      password,
      userPresent.password
    );
    if (PasswordCorrect) {
      // create a JWT token
      const token = await jwt.sign(
        { _id: userPresent._id },
        "StackOverLove@123#",
        { expiresIn: "7d" }
      );

      // Send the token inside the cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });

      res.status(200).send("User Login succesfull");
    } else {
      throw new Error("Password Not Correct");
    }
  } catch (err) {
    res.status(500).send("Something Went Wrong Error:" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Something Went Wrong Error:" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.username + " Sent the request");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
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
