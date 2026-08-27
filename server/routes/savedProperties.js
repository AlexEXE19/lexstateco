const express = require("express");
const router = express.Router();

const {
  getSavedPropertiesByUserId,
  checkIfPropertyIsSaved,
  saveProperty,
  unsaveProperty,
} = require("../controllers/savedPropertiesController");
const { requireAuth } = require("../middlewares/auth");
const catchAsync = require("../middlewares/catchAsync");

router.use(requireAuth);

// Get all saved properties by user ID
router.get("/:userId", catchAsync(getSavedPropertiesByUserId));

// Check if a property is saved by the current user
router.post("/check", catchAsync(checkIfPropertyIsSaved));

// Save a property for a user
router.post("/", catchAsync(saveProperty));

// Unsave a property for a user
router.delete("/", catchAsync(unsaveProperty));

module.exports = router;
