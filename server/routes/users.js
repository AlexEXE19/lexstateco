const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserPassword,
  updateUserFeedbackRating,
} = require("../controllers/userController");
const { requireAuth } = require("../middlewares/auth");
const catchAsync = require("../middlewares/catchAsync");

// Get all users
router.get("/", catchAsync(getAllUsers));

// Get a user by their ID - public: property cards show the seller's name
// and phone to anyone browsing, logged in or not.
router.get("/:id", catchAsync(getUserById));

// Get a user by their email (via query ?email=)
router.get("/email/search", catchAsync(getUserByEmail));

// Update the authenticated user's own password (requires the current one)
router.put("/change-password", requireAuth, catchAsync(updateUserPassword));

// Update the authenticated user's feedback rating (or set it from null)
router.put(
  "/:id/give-feedback",
  requireAuth,
  catchAsync(updateUserFeedbackRating),
);

module.exports = router;
