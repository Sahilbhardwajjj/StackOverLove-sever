const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect for status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creating a compound index for fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Making a pre function before save , for checking connectn req to not send to yourself
// Never use arrow fn in schema methods and function
// This fn only allows next . not express req,res
connectionRequestSchema.pre("save", function (next) {
  const currConnection = this;
  if (currConnection.fromUserId.equals(currConnection.toUserId)) {
    throw new Error("Cannot send Connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = new model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
