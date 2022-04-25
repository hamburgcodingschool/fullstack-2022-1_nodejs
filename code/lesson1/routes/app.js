const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("<html><head><title>Works</title></head><body><b>It</b> works!</body></html>");
    console.log("Request on /");
});
app.get("/hello", (req, res) => {
    res.send("Hello from the other side");
    console.log("Request on /hello");
});

app.listen(3000, () => {
    console.log("Server wurde gestartet...");
});
