const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
    const PasswordCorrect = await userPresent.validatePassword(password);

    // After matching the password
    if (PasswordCorrect) {
      // create a JWT token
      const token = await userPresent.getJWT();

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

authRouter.post("/logout", async (req, res) => {
  try {
    const isLogout = res.clearCookie("token");
    if (!isLogout) {
      throw new Error("User not logged out ");
    } else {
      res.status(200).send("User Logout Successfull");
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = authRouter;
