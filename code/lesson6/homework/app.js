const express = require("express");
const app = express();
const path = require("path");
const md5 = require("md5");
const basicAuth = require("express-basic-auth"); // https://www.npmjs.com/package/express-basic-auth
const PORT = 3000;
// use the mongoose package to connect to the mongo db - see https://mongoosejs.com
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todo-app");

const Url = mongoose.model("Urls", {
  short: {
    type: String,
    unique: true, // `short` must be unique
  },
  long: String,
});

const User = mongoose.model("Users", {
  username: {
    type: String,
    unique: true, // `username` must be unique
  },
  passwordHash: String,
});

app.use(
  "/secret",
  basicAuth({
    challenge: true,
    realm: "401",
    authorizer: async (
      vom_benutzer_eingegebener_username,
      vom_benutzer_eingegebenes_password,
      callback
    ) => {
      const userList = await User.find({
        username: vom_benutzer_eingegebener_username,
      });
      if (userList.length === 1) {
        // console.log(md5(vom_benutzer_eingegebenes_password));
        if (
          userList[0].passwordHash === md5(vom_benutzer_eingegebenes_password)
        ) {
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
    authorizeAsync: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const sendStatus = (err, res, id = null) => {
  if (err) {
    res.status(500).send({ ok: false, err: err });
  } else {
    if (id !== null) {
      res.send({ ok: true, id: id });
    } else {
      res.send({ ok: true });
    }
  }
};

app.get("/secret/url", (req, res) => {
  Url.find((err, urls) => {
    if (err) {
      res.status(500).send({ ok: false, err: err });
    } else {
      res.send({ ok: true, urls: urls });
    }
  });
});

app.post("/secret/url", (req, res) => {
  const url = new Url(req.body);
  url.save((err, data) => sendStatus(err, res, data ? data._id : null));
});

app.delete("/secret/url/:id", (req, res) => {
  console.log(`Deleting ${req.params.id}`);
  Url.findByIdAndDelete(req.params.id, (err) =>
    sendStatus(err, res, req.params.id)
  );
});

app.put("/secret/url/:id", (req, res) => {
  console.log(req.body);
  console.log(`Updating ${req.params.id}`);
  Url.findByIdAndUpdate(req.params.id, req.body, (err) =>
    sendStatus(err, res, req.params.id)
  );
});

app.get("/secret/user", (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.status(500).send({ ok: false, err: err });
    } else {
      res.send({ ok: true, users: users });
    }
  });
});

app.post("/secret/user", (req, res) => {
  req.body.passwordHash = md5(req.body.passwordHash);
  const url = new User(req.body);
  url.save((err, data) => sendStatus(err, res, data ? data._id : null));
});

app.delete("/secret/user/:id", (req, res) => {
  console.log(`Deleting ${req.params.id}`);
  User.findByIdAndDelete(req.params.id, (err) =>
    sendStatus(err, res, req.params.id)
  );
});

app.put("/secret/user/:id", (req, res) => {
  if (req.body.passwordHash) {
    req.body.passwordHash = md5(req.body.passwordHash);
  }
  console.log(`Updating ${req.params.id}`);
  User.findByIdAndUpdate(req.params.id, req.body, (err) =>
    sendStatus(err, res, req.params.id)
  );
});

app.get("/secret/logout", (req, res) => {
  res
    .status(401)
    .send(
      '<!DOCTYPE html><p>You\'re not authorised. <a href="/secret">Login</a>.</p>'
    );
});

app.get("/:short", async (req, res) => {
  const url = await Url.findOne({ short: req.params.short });
  if (url) {
    res.redirect(301, url.long);
  } else {
    res.status(404).send(`URL ${req.params.short} not found`);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
