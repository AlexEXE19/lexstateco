const db = require("../config/db");

const getSavedPropertiesByUserId = (req, res) => {
  const { userId } = req.params;

  const query = `SELECT property_id FROM saved_properties WHERE user_id = ?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error getting the saved properties: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json(result);
  });
};

const checkIfPropertyIsSaved = (req, res) => {
  const { userId, propertyId } = req.body;

  const query = `SELECT COUNT(*) FROM saved_properties WHERE user_id = ? AND property_id = ?`;

  db.query(query, [userId, propertyId], (err, result) => {
    if (err) {
      console.error("Error getting saved properties: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    const count = result[0].count;
    res.json({ count });
  });
};

const saveProperty = (req, res) => {
  const { userId, propertyId } = req.body;

  if (!userId || !propertyId) {
    console.error("Missing userId or propertyId");
    return res.status(400).json({ message: "Missing userId or propertyId" });
  }

  const query = `INSERT INTO saved_properties (user_id, property_id) VALUES (?, ?)`;

  db.query(query, [userId, propertyId], (err, result) => {
    if (err) {
      console.error("Error saving the property:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json({ message: "Property saved successfully", result });
  });
};

const unsaveProperty = (req, res) => {
  const { userId, propertyId } = req.body;

  const query = `DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?`;

  db.query(query, [userId, propertyId], (err, result) => {
    if (err) {
      console.error("Error unsaving the property: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json({ message: "Property unsaved successfully" });
  });
};

module.exports = {
  getSavedPropertiesByUserId,
  checkIfPropertyIsSaved,
  saveProperty,
  unsaveProperty,
};
