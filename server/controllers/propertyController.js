const fs = require("fs");
const path = require("path");
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

// Create a new property - sellerId comes from the authenticated user, not
// the request body, so you can't list a property under someone else's name.
const createProperty = async (req, res) => {
  const {
    title,
    price,
    location,
    neighborhood,
    zipCode,
    description,
    size,
    imageRefs = [],
  } = req.body;

  try {
    const property = await Property.create({
      title,
      price,
      location,
      neighborhood,
      zip_code: zipCode,
      description,
      size,
      image_refs: imageRefs,
      seller_id: req.user.id,
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

// Edit an existing property - only the listing's own seller may edit it.
const editProperty = async (req, res) => {
  const { propertyId } = req.params;
  const {
    title,
    price,
    location,
    neighborhood,
    zipCode,
    description,
    size,
    imageRefs,
  } = req.body;

  try {
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (String(property.seller_id) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updatedFields = {
      title,
      price,
      location,
      neighborhood,
      zip_code: zipCode,
      description,
      size,
    };

    if (imageRefs !== undefined) {
      updatedFields.image_refs = imageRefs;
    }

    await property.update(updatedFields);

    res
      .status(200)
      .json({ message: "Property updated successfully", updatedProperty: property });
  } catch (err) {
    console.error("Error updating property: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the property." });
  }
};

// Delete a property - only the listing's own seller may delete it.
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (String(property.seller_id) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await property.destroy();

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property: ", err);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the property." });
  }
};

// Upload images for a property (max handled by multer in route). Multer
// writes the files to disk before this handler runs, so on a rejection we
// clean them back up rather than leaving orphaned files under someone
// else's property id.
const uploadPropertyImages = async (req, res) => {
  const { propertyId } = req.params;
  const files = req.files || [];

  const cleanupUploaded = () => {
    files.forEach((file) => {
      fs.unlink(file.path, () => {});
    });
  };

  try {
    const property = await Property.findByPk(propertyId);

    if (!property) {
      cleanupUploaded();
      return res.status(404).json({ message: "Property not found" });
    }

    if (String(property.seller_id) !== String(req.user.id)) {
      cleanupUploaded();
      return res.status(403).json({ message: "Not allowed" });
    }

    const uploadedPaths = files.map((file) => {
      // store relative path for frontend consumption
      const relative = path
        .relative(path.join(__dirname, ".."), file.path)
        .replace(/\\/g, "/");
      return relative;
    });

    const updatedImages = [...(property.image_refs || []), ...uploadedPaths];
    property.image_refs = updatedImages.slice(0, 8); // enforce max 8
    await property.save();

    return res.status(200).json({
      message: "Images uploaded",
      imageRefs: property.image_refs,
    });
  } catch (err) {
    console.error("Error uploading property images: ", err);
    cleanupUploaded();
    return res
      .status(500)
      .json({ message: "An error occurred while uploading images." });
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
  uploadPropertyImages,
};
