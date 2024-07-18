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

// LOGIN API
router.post("/login", (request, response) => {
  const { email, password } = request.body;

  const statement = `SELECT id, name, email FROM users WHERE email = ? AND password = ?`;

  // encrypting the provided password
  const encryptedPassword = String(crypto.SHA256(password));

  db.execute(statement, [email, encryptedPassword], (error, users) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      if (users.length === 0) {
        response.send(utils.createErrorResponse("User not found!"));
      } else {
        const user = users[0];

        // creating a payload with user information for JWT token
        const payload = {
          user_id: user.id,
          user_name: user.name,
          user_email: user.email,
        };

        // generating a JWT token with the payload and a secret key
        const token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: "1h" });

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
  });
});

// Protected route example
router.get("/students", verifyToken, (req, res) => {
  // Query to fetch list of students from database
  console.log("students");
  const query = "SELECT * FROM students";

  db.execute(query, (error, students) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse(students));
    }
  });
});
module.exports = router;
