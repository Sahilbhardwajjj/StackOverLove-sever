require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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

// API Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Root route handler - prevents 404 on base URL
app.get("/", (req, res) => {
  res.status(200).json({
    message: "StackOverLove API is running",
    status: "success",
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

module.exports = app;
