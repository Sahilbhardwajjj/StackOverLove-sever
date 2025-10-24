const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const app = express();

app.get("/admin", adminAuth);

app.get("/admin/getAllData", (req, res, next) => {
  res.send("All Data is sent");
});

app.get("/admin/deleteAllData", (req, res, next) => {
  res.send("Data is Deleted");
});

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
