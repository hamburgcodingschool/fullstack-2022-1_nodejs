const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

let anzahlAutos = 0;
let anzahlFahrräder = 0;

app.get("/cars", (req, res) => {
  res.send({ antw: anzahlAutos });
});
app.post("/cars", (req, res) => {
  anzahlAutos = req.body.value;
  res.send({ antw: anzahlAutos });
});
app.put("/cars", (req, res) => {
  anzahlAutos = anzahlAutos + 1;
  res.send({ antw: anzahlAutos });
});
app.delete("/cars", (req, res) => {
  anzahlAutos = 0;
  res.send({ antw: anzahlAutos });
});

app.get("/bikes", (req, res) => {
  res.send({ antw: anzahlFahrräder });
});
app.post("/bikes", (req, res) => {
  anzahlFahrräder = req.body.value;
  res.send({ antw: anzahlFahrräder });
});
app.put("/bikes", (req, res) => {
  anzahlFahrräder = anzahlFahrräder + 1;
  res.send({ antw: anzahlFahrräder });
});
app.delete("/bikes", (req, res) => {
  anzahlFahrräder = 0;
  res.send({ antw: anzahlFahrräder });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
