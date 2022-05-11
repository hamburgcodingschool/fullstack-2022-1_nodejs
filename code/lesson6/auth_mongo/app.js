require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const md5 = require('md5');
const basicAuth = require("express-basic-auth"); // https://www.npmjs.com/package/express-basic-auth
// use the mongoose package to connect to the mongo db - see https://mongoosejs.com
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_CONNECT);

const User = mongoose.model("Users", {
  username: String,
  passwordHash: String,
  rights: String,
});

app.use(
  "/secret",
  basicAuth({
    challenge: true,
    realm: "401",
    authorizer: async (vom_benutzer_eingegebener_username, vom_benutzer_eingegebenes_password, callback) => {
      const userList = await User.find({ username: vom_benutzer_eingegebener_username});
      if (userList.length === 1) {
        if (userList[0].passwordHash === md5(vom_benutzer_eingegebenes_password)) {
          // authenticated
          return callback(null, true);
        } else {
          // not authenticated
          return callback(null, false);
        }
      } else {
        // user nicht gefunden
        return callback(null, false);
      }
    },
    authorizeAsync: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/pub", (req, res) => {
  res.send("public");
});

app.get("/secret/sec", (req, res) => {
  res.send("secret!");
});

app.post("/secret/user", async (req, res) => {
  const user = new User({
    username: req.body.user,
    passwordHash: md5(req.body.password),
    rights: req.body.right,
  });
  await user.save();
  res.send("ok");
});

app.get("/secret/logout", (req, res) => {
  res.status(401).send('<!DOCTYPE html><p>You\'re not authorised. <a href="/secret">Login</a>.</p>');
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
