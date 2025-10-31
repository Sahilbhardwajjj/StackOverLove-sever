const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Email Address is invalid",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [5, "Password too short"],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
    },
    bio: {
      type: String,
      default: "Default about of user",
    },
    skills: {
      type: [String],
      minLength: [4, "User must list at least 4 skills."],
      maxLength: [10, "User cannot list more than 10 skills."],
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age is less that required"],
      max: [70, "Age is too big , you should do meditation"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
