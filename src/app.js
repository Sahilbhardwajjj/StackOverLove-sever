require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: [process.env.FRONTEND_URL_1, process.env.FRONTEND_URL_2], // Must be the EXACT domain/port of your frontend
    credentials: true, // Must be true because your client uses withCredentials: true
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], // Ensure PATCH and OPTIONS are allowed
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const PORT = process.env.PORT;

dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Cannot be Establisheds" + err.message);
  });
