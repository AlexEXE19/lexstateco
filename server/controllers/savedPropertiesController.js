const { SavedProperty } = require("../models"); // adjust if needed
const { assertSelf } = require("../middlewares/auth");

// Get saved properties by user ID
const getSavedPropertiesByUserId = async (req, res) => {
  const { userId } = req.params;
  if (!assertSelf(req, res, userId)) return;

  const saved = await SavedProperty.findAll({
    where: { userId },
    attributes: ["propertyId"],
  });

  res.json(saved);
};

// Check if a property has been saved by the current user - it is used to toggle the button from 'Save' to 'Unsave' or other way around
const checkIfPropertyIsSaved = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user.id;

  const count = await SavedProperty.count({
    where: { userId, propertyId },
  });

  res.json({ count });
};

// Save a property into the user account
const saveProperty = async (req, res) => {
  const { userId, propertyId } = req.body;

  if (!userId || !propertyId) {
    return res.status(400).json({ message: "Missing userId or propertyId" });
  }

  const result = await SavedProperty.create({
    userId,
    propertyId,
  });

  res.json({ message: "Property saved successfully", result });
};

// Unsave a property from the user account
const unsaveProperty = async (req, res) => {
  const { userId, propertyId } = req.body;

  await SavedProperty.destroy({
    where: { userId, propertyId },
  });

  res.json({ message: "Property unsaved successfully" });
};

module.exports = {
  getSavedPropertiesByUserId,
  checkIfPropertyIsSaved,
  saveProperty,
  unsaveProperty,
};
