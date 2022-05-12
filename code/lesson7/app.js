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

const BAD_WORDS = ["doof"];

app.use(express.json());

app.get("/todo/:offset/:limit", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  pool.query(
    "SELECT * FROM todos LIMIT ? OFFSET ?",
    [parseInt(req.params.limit), parseInt(req.params.offset)],
    (error, results, fields) => {
      res.send({ ok: true, result: results });
    }
  );
});

app.post("/todo", (req, res) => {
  console.log(req.body);
  console.log(`INSERT INTO todos (todo) VALUES("${req.body.text}")`);
  pool.query(
    `INSERT INTO todos (todo) VALUES(?)`,
    req.body.text,
    (error, results, fields) => {
      if (error) console.log(error);
      console.log(results);
      res.send({ ok: true });
    }
  );
});

app.put("/todo/:id", (req, res) => {
  pool.query(
    "UPDATE todos SET todo=? WHERE id=?",
    [req.body.text, req.params.id],
    (error, results, fields) => {
      console.log(results);
      console.log(fields);
      if (error) {
        res.status(500).send({ ok: false, error: error });
      } else {
        res./*status(200).*/ send({ ok: true });
      }
    }
  );
});

app.delete("/todo/:id", (req, res) => {
  pool.query(
    "DELETE FROM todos WHERE id=?",
    req.params.id,
    (error, results, fields) => {
      console.log(results);
      console.log(fields);
      if (error) {
        res.status(500).send({ ok: false, error: error });
      } else {
        res./*status(200).*/ send({ ok: true });
      }
    }
  );
});

app.listen(PORT);
