const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  createUser,
} = require("../controllers/userController");

// Authenticate a user by their email and password
router.post("/login", authenticateUser);

// Create a new user
router.post("/register", createUser);

module.exports = router;
