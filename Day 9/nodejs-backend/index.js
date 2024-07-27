const express = require("express");
const cors = require("cors");
const { pool } = require("./db.js");

// mysql --- nodejs --- server

// 1st option --> browser -> html + fetch() weather
// 2nd option --> postman
// browser(frontend) --- postman --- server()

// Create an instance of the express application
const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());
// app.use(cors());

// Define a GET endpoint to retrieve all users from the database
app.get("/users", async (req, res) => {
  try {
    // Perform a query to select all users from the 'users' table
    const [rows] = await pool.query("SELECT * FROM users");

    // Send the result of the query as a JSON response
    res.json(rows);
  } catch (err) {
    // If an error occurs, send a 500 status code with the error message
    res.status(500).json({ error: err.message });
  }
});

// GET a single user by ID
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new user
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    res.json({ id: result.insertId, name, email, password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT to update a user by ID
app.put("/users/:id", async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;
  try {
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: userId, name, email, password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a user by ID
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
