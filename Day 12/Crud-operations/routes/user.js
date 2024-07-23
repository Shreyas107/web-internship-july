const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");
const verifyToken = require("../verifyToken");

// REGISTER API
router.post("/register", (request, response) => {
  console.log("====================================");
  console.log(request);
  console.log("====================================");

  const { name, email, password } = request.body;

  // create a sql statement
  const statement = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  // encrypt the password
  const encryptedPassword = String(crypto.SHA256(password));

  db.execute(statement, [name, email, encryptedPassword], (error, result) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      response.send(
        utils.createSuccessResponse("User registered successfully")
      );
    }
  });
});

router.post("/login", (request, response) => {
  const { email, password } = request.body;

  // First query to check if the email exists
  const emailCheckStatement = `SELECT id, name, email FROM users WHERE email = ?`;

  db.execute(emailCheckStatement, [email], (error, users) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      if (users.length === 0) {
        response.send(utils.createErrorResponse("Invalid email!"));
      } else {
        const user = users[0];

        // Encrypt the provided password
        const encryptedPassword = String(crypto.SHA256(password));

        // Second query to check if the password matches
        const passwordCheckStatement = `SELECT id, name, email FROM users WHERE email = ? AND password = ?`;

        db.execute(
          passwordCheckStatement,
          [email, encryptedPassword],
          (error, users) => {
            if (error) {
              response.send(utils.createErrorResponse(error));
            } else {
              if (users.length === 0) {
                response.send(utils.createErrorResponse("Invalid password!"));
              } else {
                const user = users[0];

                // Creating a payload with user information for JWT token
                const payload = {
                  user_id: user.id,
                  user_name: user.name,
                  user_email: user.email,
                };

                // Generating a JWT token with the payload and a secret key
                const token = jwt.sign(payload, config.SECRET_KEY);

                console.log("====================================");
                console.log("token-", token);
                console.log("====================================");

                response.send(
                  utils.createSuccessResponse({
                    token,
                    user_name: user.name,
                  })
                );
              }
            }
          }
        );
      }
    }
  });
});

// Protected route example
router.get("/students", verifyToken, (req, res) => {
  // Query to fetch list of students from database
  console.log("students");
  const query = "SELECT * FROM users";

  db.execute(query, (error, students) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse(students));
    }
  });
});

// Create a new student
router.post("/students", verifyToken, (req, res) => {
  const { name, email } = req.body;

  console.log("body- ", req.body);

  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.execute(query, [name, email], (error, results) => {
    if (error) {
      console.error("Database error: ", error);
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(
        utils.createSuccessResponse({ id: results.insertId, name, email })
      );
    }
  });
});

// Update a student
router.put("/students/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.execute(query, [name, email, id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ id, name, email }));
    }
  });
});

// Delete a student
router.delete("/students/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.execute(query, [id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ id }));
    }
  });
});
module.exports = router;
