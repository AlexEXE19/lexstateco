const express = require("express");
const router = express.Router();

const {
  getSavedPropertiesByUserId,
  checkIfPropertyIsSaved,
  saveProperty,
  unsaveProperty,
} = require("../controllers/savedPropertiesController");

// Get all saved properties by user ID
router.get("/:userId", getSavedPropertiesByUserId);

// Check if a property is saved by the current user
router.post("/check", checkIfPropertyIsSaved);

// Save a property for a user
router.post("/", saveProperty);

// Unsave a property for a user
router.delete("/", unsaveProperty);

module.exports = router;
