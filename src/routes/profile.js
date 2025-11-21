const express = require("express");
const userAuth = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "User Profile",
      data: user,
    });
  } catch (err) {
    res.status(500).send("Something Went Wrong Error:" + err.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      res.status(400).json({
        message: "Edit Fields are not valid",
      });
    }

    const loggedInUser = req.user;
    const updateUserData = req.body;

    Object.keys(updateUserData).every(
      (key) => (loggedInUser[key] = updateUserData[key])
    );

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} , Your Data is Updated Successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = profileRouter;
