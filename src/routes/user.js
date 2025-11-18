const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

// Get all the pending connection request (interested) for LoggedInUser
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    // Finding Connection Request
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.status(200).json({
      message: "The connection request you have ",
      connectionRequests,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error : " + err.message,
    });
  }
});

// All the accepted connections of loggedInUser
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Finding all the accepted connection request where from and to is loggedInUser
    const connectionRequestAccepted = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    }).populate(["fromUserId", "toUserId"], ["firstName", "lastName"]);

    res.status(200).json({
      message: "All the Connection Requests of " + loggedInUser.firstName,
      connectionRequestAccepted,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error : " + err.message,
    });
  }
});

module.exports = userRouter;
