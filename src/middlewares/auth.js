const jwt = require("jsonwebtoken");
const User = require("../models/user");

// user Authorization for all GET,POST,PATCH,DELETE requests
const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not Valid");
    }

    // Verfying the token
    const { _id } = await jwt.verify(token, "StackOverLove@123#");

    // Finding the user from the _id
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }

    //Sending User to the Request handler
    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = userAuth;
