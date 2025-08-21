const express = require("express");
const router = express.Router();

const {
  getAllProperties,
  getPropertyById,
  getPropertiesByLocation,
  getPropertyBySellerId,
  createProperty,
  editProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// Route to get all properties
router.get("/", getAllProperties);

// Route to get properties  ID
router.get("/:id", getPropertyById);

// Route to get properties by seller ID
router.get("/seller-id/:sellerId/", getPropertyBySellerId);

// Route to get properties by location
router.get("/location/:location/", getPropertiesByLocation);

// Route to create a new property
router.post("/", createProperty);

// Route to edit a property by ID
router.put("/:propertyId/", editProperty);

// Route to delete a property by ID
router.delete("/:propertyId", deleteProperty);

module.exports = router;
