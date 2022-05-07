const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;
// use the mongoose package to connect to the mongo db - see https://mongoosejs.com
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todo-app");

const Todo = mongoose.model("todos", {
  text: String,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

let todoliste = [
  { id: 1, text: "aufgabe 1" },
  { id: 2, text: "aufgabe 2" },
];

async function sendFullToDoList(res, err = "") {
  const data_in_database = await Todo.find();
  res.send({ todos: data_in_database, err: err });
}

app.get("/todos", async (req, res) => {
  sendFullToDoList(res);
});
app.post("/todo", async (req, res) => {
  const dataToInsertIntoDB = new Todo({
    text: req.body.todo1,
  });
  await dataToInsertIntoDB.save();

  sendFullToDoList(res);
});
app.delete("/todo/:id", (req, res) => {
  console.log(req.params);
  // ID is a string
  const id = req.params.id;

  Todo.findByIdAndDelete(id, (err) => {
    sendFullToDoList(res, err);
  });
});

app.put("/todo/:id", (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndUpdate(id, { text: req.body.text }, (err) => {
    sendFullToDoList(res, err);
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
