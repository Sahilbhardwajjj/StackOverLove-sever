const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
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

    // Finding all the accepted connection request where "from" and "to" is loggedInUser
    const connectionRequestAccepted = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", ["firstName", "lastName", "role", "age"])
      .populate("toUserId", ["firstName", "lastName", "role", "age"]);

    const data = connectionRequestAccepted.map((v) => {
      if (loggedInUser._id.equals(v.fromUserId._id)) {
        return v.toUserId;
      } else {
        return v.fromUserId;
      }
    });

    res.status(200).json({
      message:
        loggedInUser.firstName + " have " + data.length + " connection request",
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error : " + err.message,
    });
  }
});

// User should not see (his own card & accepted/rejected/ignored/interested)
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Getting all connectionRequest where loggedInUser is present in "fromUserId" and "toUserId"
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Creating a Set which has unique Id's from connection request
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((k) => {
      hideUserFromFeed.add(k.fromUserId.toString()),
        hideUserFromFeed.add(k.toUserId.toString());
    });

    // Fetching User which are not present in hideUserFromFeed
    const usersOnFeed = await User.find({
      _id: { $nin: [...hideUserFromFeed], $ne: loggedInUser._id },
    })
      .select(
        "firstName lastName dateOfBirth gender role bio skills age photoUrl"
      )
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed of User",
      data: usersOnFeed,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error : " + err.message,
    });
  }
});

module.exports = userRouter;
