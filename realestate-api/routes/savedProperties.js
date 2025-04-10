const express = require("express");
const router = express.Router();

const {
  getSavedPropertiesByUserId,
  saveProperty,
  unsaveProperty,
} = require("../controllers/savedPropertiesController");

// Get all saved properties by user ID
router.get("/:user-id", getSavedPropertiesByUserId);

// Save a property for a user
router.post("/", saveProperty);

// Unsave a property for a user
router.delete("/", unsaveProperty);

module.exports = router;
