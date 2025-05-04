const Property = require("../models/Property"); // Import the Sequelize model

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching properties: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching properties." });
  }
};

// Get a property by its ID
const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findOne({ where: { id } });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (err) {
    console.error("Error getting property: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the property." });
  }
};

// Get properties by location - not used but subject of using in future version to avoid overfetching
const getPropertiesByLocation = async (req, res) => {
  const { location } = req.body;

  try {
    const properties = await Property.findAll({ where: { location } });

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: `No properties found in location: ${location}` });
    }

    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching properties by location: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching properties." });
  }
};

// Get properties by seller ID
const getPropertyBySellerId = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const properties = await Property.findAll({
      where: { seller_id: sellerId },
    });

    if (properties.length === 0) {
      return res
        .status(200)
        .json({ message: `No properties found for seller ID: ${sellerId}` });
    }

    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching properties by seller ID: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching properties." });
  }
};

// Create a new property
const createProperty = async (req, res) => {
  const { title, price, location, description, size, distance, sellerId } =
    req.body;

  try {
    const property = await Property.create({
      title,
      price,
      location,
      description,
      size,
      distance,
      sellerId,
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (err) {
    console.error("Error creating property: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the property." });
  }
};

// Edit an existing property - not used yet, also subject for future update
const editProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { title, price, imageUrl, description } = req.body;

  try {
    const [updated] = await Property.update(
      { title, price, imageUrl, description },
      { where: { id: propertyId } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    const updatedProperty = await Property.findByPk(propertyId);
    res
      .status(200)
      .json({ message: "Property updated successfully", updatedProperty });
  } catch (err) {
    console.error("Error updating property: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the property." });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Property.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the property." });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getPropertiesByLocation,
  getPropertyBySellerId,
  createProperty,
  editProperty,
  deleteProperty,
};
