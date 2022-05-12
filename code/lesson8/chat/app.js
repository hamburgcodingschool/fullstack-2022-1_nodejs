const express = require("express");
const app = express();
const path = require("path");
PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

const WebSocket = require("ws");
const server = new WebSocket.Server({
  port: 8080,
});

let sockets = [];
server.on("connection", function (socket) {
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on("message", function (msg) {
    sockets.forEach((s) => s.send(msg));
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on("close", function () {
    sockets = sockets.filter((s) => s !== socket);
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
