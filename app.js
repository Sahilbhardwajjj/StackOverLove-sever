require("dotenv").config();
const express = require("express");
const dbConnect = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Cache the database connection globally to reuse across serverless invocations
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    await dbConnect();
    cachedDb = true;
    console.log("Database connected successfully");
    return cachedDb;
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    throw err;
  }
}

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL_1,
      process.env.FRONTEND_URL_2,
      process.env.FRONTEND_URL_3,
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Initialize database connection on app startup
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});

const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Export the app for Vercel
module.exports = app;
