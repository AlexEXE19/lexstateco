const { SavedProperty } = require("../models"); // adjust if needed

// Get saved properties by user ID
const getSavedPropertiesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const saved = await SavedProperty.findAll({
      where: { user_id: userId },
      attributes: ["property_id"],
    });

    res.json(saved);
  } catch (err) {
    console.error("Error getting the saved properties:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if a property has been saved by the current user - it is used to toggle the button from 'Save' to 'Unsave' or other way around
const checkIfPropertyIsSaved = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    const count = await SavedProperty.count({
      where: { userId, propertyId },
    });

    res.json({ count });
  } catch (err) {
    console.error("Error checking if property is saved:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Save a property into the user account
const saveProperty = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    if (!userId || !propertyId) {
      return res.status(400).json({ message: "Missing userId or propertyId" });
    }

    const result = await SavedProperty.create({
      user_id: userId,
      property_id: propertyId,
    });

    res.json({ message: "Property saved successfully", result });
  } catch (err) {
    console.error("Error saving the property:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Unsave a property from the user account
const unsaveProperty = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    await SavedProperty.destroy({
      where: { user_id: userId, property_id: propertyId },
    });

    res.json({ message: "Property unsaved successfully" });
  } catch (err) {
    console.error("Error unsaving the property:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getSavedPropertiesByUserId,
  checkIfPropertyIsSaved,
  saveProperty,
  unsaveProperty,
};
