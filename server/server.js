const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sql = require("mssql");
const app = express();

//! middleware
app.use(express.json());
app.use(cors());

//! MSSQL CONFIG
const config = {
  database: process.env.MSSQL_DATABASE,
  server: process.env.MSSQL_SERVER,
  user: process.env.MSSQL_USERNAME,
  password: process.env.MSSQL_PASSWORD,
  port: process.env.PORT,
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

//! MSSQL CONNECTION
sql.connect(config, (err) => {
  if (err) {
    console.error("Database connection error");
  } else {
    console.log("MSSQL DB Connected!");
  }
});

//! GET: GET ALL TODOS
app.get("/todos", (req, res) => {
  const request = new sql.Request();
  request.query("SELECT * FROM Todos", (err, result) => {
    if (err) {
      console.log("Query Error: ", err);
      return res.status(500).send({ error: "Internal server error!" });
    } else {
      console.log("Query Result: ", result.recordset);
      return res.status(200).json(result.recordset);
    }
  });
});

//! GET: GET SINGLE POST
app.get("/todos/:id", (req, res) => {
  const request = new sql.Request();

  const id = req.params.id;

  request.query(`SELECT * FROM Todos WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log("Query Error: ", err);
      return res.status(500).send({ error: "Internal server error!" });
    } else {
      console.log("Query Result: ", result.recordset);
      return res.status(200).json(result.recordset);
    }
  });
});

//! POST: CREATE TODO
app.post("/add-todo", (req, res) => {
  const request = new sql.Request();

  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  request.query(
    `INSERT INTO Todos (title) VALUES ('${title}')`,
    (err, result) => {
      if (err) {
        console.log("Query Error: ", err);
        return res.status(500).send({ error: "Internal server error!" });
      } else {
        console.log("Todo created successfully");
        return res.status(201).json({ message: "Todo created successfully" });
      }
    }
  );
});

//! DELETE: DELETE TODO
app.delete("/delete-todo/:id", (req, res) => {
  const request = new sql.Request();

  const id = req.params.id;

  request.query(`DELETE FROM Todos WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log("Query Error: ", err);
      return res.status(500).send({ error: "Internal server error!" });
    } else {
      console.log("Todo deleted successfully");
      return res.status(200).send({ message: "Todo deleted successfully" });
    }
  });
});

//! PUT: UPDATE TODO
app.put("/update-todo/:id", (req, res) => {
  const request = new sql.Request();

  const id = req.params.id;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  request.query(
    `UPDATE Todos SET title = '${title}' WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log("Query Error: ", err);
        return res.status(500).send({ error: "Internal server error!" });
      } else {
        console.log("Todo updated successfully");
        return res.status(200).send({ message: "Todo updated successfully!" });
      }
    }
  );
});

//! LISTEN PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
