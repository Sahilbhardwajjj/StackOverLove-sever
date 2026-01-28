require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // For serverless environments, we need to handle connection properly
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
  return mongoose.connection;
};

module.exports = dbConnect;
