const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

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
