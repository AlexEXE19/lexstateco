const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserPassword,
} = require("../controllers/userController");
const { requireAuth } = require("../middlewares/auth");

// Get all users
router.get("/", getAllUsers);

// Get a user by their ID - public: property cards show the seller's name
// and phone to anyone browsing, logged in or not.
router.get("/:id", getUserById);

// Get a user by their email (via query ?email=)
router.get("/email/search", getUserByEmail);

// Update the authenticated user's own password (requires the current one)
router.put("/change-password", requireAuth, updateUserPassword);

module.exports = router;
