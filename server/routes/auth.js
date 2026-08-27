const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  createUser,
} = require("../controllers/userController");
const catchAsync = require("../middlewares/catchAsync");

// Authenticate a user by their email and password
router.post("/login", catchAsync(authenticateUser));

// Create a new user
router.post("/register", catchAsync(createUser));

module.exports = router;
