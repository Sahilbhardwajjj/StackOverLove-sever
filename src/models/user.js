const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      minLength: 3,
      maxLength: 10,
    },
    lastName: {
      type: String,
      required: true,
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
      enum: ["Male", "Female", "Others", "Prefer Not to Say"],
      required: true,
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
    photoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Creating index
userSchema.index({ firstName: 1, lastName: 1 });

// Making methods for the User Schema
userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, "StackOverLove@123#", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const isPasswordValid = await bcrypt.compare(passwordByUser, this.password);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
