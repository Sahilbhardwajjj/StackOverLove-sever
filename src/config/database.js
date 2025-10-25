const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose.connect(
    "mongodb+srv://sahil:sahil123@stackoverlove.n5ziqnh.mongodb.net/StackOverLove"
  );
};

module.exports = dbConnect;
