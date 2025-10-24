const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const app = express();

app.get("/user", (req, res) => {
  try {
    throw new Error("Error Occured");
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
