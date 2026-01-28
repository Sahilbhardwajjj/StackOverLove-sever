require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// user Authorization for all GET,POST,PATCH,DELETE requests
const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Please LoginIn",
      });
    }

    // Verfying the token
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);

    // Finding the user from the _id
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({
        message: "User is not Available",
      });
    }

    //Sending User to the Request handler
    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = userAuth;
