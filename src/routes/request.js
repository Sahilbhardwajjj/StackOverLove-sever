const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // Fetching all the data
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // CC : Finding if the toUser is present in the db
      const isToUserPresent = await User.findById(toUserId);
      if (!isToUserPresent) {
        return res.status(400).json({
          message: "User is not present whom you want to send request",
        });
      }

      // CC : Allowing only "ignored" "interested" to be Valid
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // CC : You should not sent connection request to yourself which is handled by pre
      // method in connectionRequest Model

      // CC : There should not be already present connection request from both end
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already present in the database",
        });
      }

      // Creating the new instance of ConnectionRequestModel
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      // Saving into the database
      const saveConnectionRequest = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName +
          " is " +
          status +
          " in " +
          isToUserPresent.firstName,
        saveConnectionRequest,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
