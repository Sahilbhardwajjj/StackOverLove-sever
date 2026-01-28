require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// 1. Database Connection Logic (Serverless optimized)
// In serverless, we connect once and reuse the connection across invocations.
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await dbConnect();
    isConnected = true;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    throw err;
  }
};

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

// 2. Middleware to ensure DB is connected before processing any request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// 3. EXPORT THE APP (Crucial for Vercel)
// Do not use app.listen() here as Vercel manages the server life cycle.
module.exports = app;
