const express = require("express");
const path = require("path");
const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.post("/formular", (req, res) => {
  console.log(req.body);
  res.send(`Willkommen ${req.body.einname}`);
});

app.listen(3000, () => {
  console.log(`Server started on Port ${PORT}...`);
});
