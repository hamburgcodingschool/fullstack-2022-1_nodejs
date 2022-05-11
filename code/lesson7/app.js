// do something with the mysql package
const mysql = require("mysql");

// create a connection pool
// with the pool we can re-use connections
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // ChoosePassword
  database: "hcs2",
  connectionLimit: 10,
});

const express = require("express");
const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/todo", (req, res) => {
  pool.query("SELECT * FROM todos", (error, results, fields) => {
    console.log(results);
    res.send({ ok: true, result: results });
  });
});

app.post("/todo", (req, res) => {
  pool.query(
    "INSERT INTO todos (todo) VALUES(?)",
    req.body.text,
    (error, results, fields) => {
      res.send({ ok: true });
    }
  );
});

app.listen(PORT);
