const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

// Get all the pending connection request for LoggedInUser
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    // Finding Connection Request
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });

    res.status(200).json({
      message: "The connection request you have ",
      connectionRequest,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error : " + err.message,
    });
  }
});

module.exports = userRouter;
