require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    return mongoose.connection;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
};

module.exports = dbConnect;
