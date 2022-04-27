const express = require("express");
const app = express();
const PORT = 3000;

function log(path) {
    console.log(`${path} requested`);
}

app.get("/", (req, res) => {
    res.send("<html><head><title>Works</title></head><body><b>It</b> works!</body></html>");
    log("/");
});
app.get("/hello", (req, res) => {
    res.send("Hello from the other side");
    log("/hello");
});

app.listen(PORT, () => {
    console.log(`Server wurde gestartet auf Port ${PORT}...`);
});
