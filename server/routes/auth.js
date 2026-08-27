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
// TODO: this is the one left for you to convert yourself - createUser
// still has its own try/catch and manual res.status(500) in
// controllers/userController.js. Once you strip that out the same way the
// others were done, wrap it here too: catchAsync(createUser).
router.post("/register", createUser);

module.exports = router;
