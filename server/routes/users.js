const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUserByEmail,
  authenticateUser,
  createUser,
  updateUserPassword,
} = require("../controllers/userController");

// Get a user by their ID
router.get("/:id", getUserById);

// Get a user by their email
router.get("/", getUserByEmail);

// Authenticate a user by their email and password
router.post("/auth", authenticateUser);

// Create a new user
router.post("/register", createUser);

// Update a user's password by their email
router.put("/change-password", updateUserPassword);

module.exports = router;
