require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = dbConnect;
