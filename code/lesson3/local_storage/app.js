const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

let anzahlAutos = 0;

app.post("/inc", (req, res) => {
  anzahlAutos = anzahlAutos + 1;
  // here the magic will happen
  res.send({ antw: anzahlAutos });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
