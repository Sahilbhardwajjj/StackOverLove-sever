const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const userAuth = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const {
    username,
    firstName,
    email,
    password,
    role,
    bio,
    skills,
    age,
    photoUrl,
  } = req.body;
  try {
    // Validate SignUp Data
    validateSignUpData(req);

    // Password Encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new Instance of the User
    let user = new User({
      username,
      firstName,
      email,
      password: hashedPassword,
      role,
      bio,
      skills,
      age,
      photoUrl,
    });

    //Saving the user
    let savedUser = await user.save();

    if (savedUser) {
      res.status(200).send("User Saved Successfully ");
    } else {
      res.status(404).send("User Not Saved");
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      Error: err.message,
    });
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
      return res.status(400).json({ message: "Enter a Valid Email Address" });
    }

    // Email is present in the database
    const userPresent = await User.findOne({ email: email });
    if (!userPresent) {
      return res.status(400).json({ message: "Enter a Valid Email Address" });
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

      res.status(200).json({
        message: "User LoggedIn Successfully",
        data: userPresent,
      });
    } else {
      return res.status(400).json({ message: "Password Not Correct" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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

authRouter.post("/forgotPassword", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if Email is Valid or Not
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      throw new Error("Email is not Valid");
    }

    // Now checking if the Email is Present in the database
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }

    // Verfiy with OTP on Email

    // Now Changing Password
    if (validator.isStrongPassword(password)) {
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;
      user.save();
      res.send("Password Updated");
    } else {
      throw new Error("Enter a Strong Password");
    }
  } catch (err) {
    res.status(500).send("Err: " + err.message);
  }
});

authRouter.patch("/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password, newPassword } = req.body;

    // Check if the password is correct with the user
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      res.status(404).send("Password not Correct");
    }

    // Now Check if the newPassword is Strong
    const isPasswordStrong = validator.isStrongPassword(newPassword);
    if (!isPasswordStrong) {
      throw new Error("Enter a Strong Password");
    }

    // Then Update the Password with newPassword
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    user.save();
    res.status(200).json({ message: "Password Changed Successfully" });
  } catch (err) {
    res.status(500).send("Err: " + err.message);
  }
});

module.exports = authRouter;
