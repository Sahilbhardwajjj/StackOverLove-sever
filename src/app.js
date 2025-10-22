const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Sahil", lastName: "Bhardwaj" });
});

app.listen(3000, () => {
  console.log("Server is listing on port 3000...");
});
