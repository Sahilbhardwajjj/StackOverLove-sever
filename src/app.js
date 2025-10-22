const express = require("express");

const app = express();

//This will only handle GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstName: "Sahil", LastName: "Bhardwaj" });
});

app.post("/user", (req, res) => {
  res.send("Data Saved to the Database");
});

app.delete("/user", (req, res) => {
  res.send("Data Deleted Successfully");
});

//This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send({ firstName: "Sahil", LastName: "Bhardwaj" });
});

app.listen(3000, () => {
  console.log("Server is listing on port 3000...");
});
