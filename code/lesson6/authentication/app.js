require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const basicAuth = require("express-basic-auth");
// use the mongoose package to connect to the mongo db - see https://mongoosejs.com
const mongoose = require("mongoose");
//mongoose.connect(process.env.MONGO_CONNECT);

app.use(
  "/secret",
  basicAuth({
    users: { admin: "secret", tobias: "meinPasswort" },
    challenge: true,
    realm: "401",
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/pub", (req, res) => {
  res.send("public");
});

app.get("/secret/sec", (req, res) => {
  res.send("secret?");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
