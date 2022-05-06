const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

let todoliste = [
  { id: 1, text: "aufgabe 1" },
  { id: 2, text: "aufgabe 2" },
];

app.get("/todos", (req, res) => {
  res.send({ todos: todoliste });
});
app.post("/todo", (req, res) => {
  const newToDoListObject = {
    id: todoliste.length + 1,
    text: req.body.todo1,
  };
  todoliste.push(newToDoListObject);
  res.send({ todos: todoliste });
});
app.delete("/todo/:id", (req, res) => {
  console.log(req.params);
  // ID is a string
  const id = parseInt(req.params.id);
  // parseInt makes a string a number, now id is a number

  // find element with id == 1 and delete it
  todoliste = todoliste.filter((eintrag_in_der_todoliste) => eintrag_in_der_todoliste.id != id);

  console.log(`Element ${id} deleted`);
  res.send({ todos: todoliste });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
