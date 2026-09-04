const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const Property = require("../models/Property"); // Import the Sequelize model
const sequelize = require("../config/db");

// jsonKey is always one of our own hardcoded field names, never user
// input, so this is safe to interpolate directly.
const locationWhere = (jsonKey, value) =>
  sequelize.where(sequelize.literal(`"location"->>'${jsonKey}'`), {
    [Op.iLike]: `%${value}%`,
  });

// Get all properties, optionally filtered by any combination of the same
// fields PropertyFilterForm exposes on the client: location (matched
// against location.city), neighborhood (matched against
// location.neighborhood), and minPrice/maxPrice (range on price). Every
// param is optional - with none given, `where` stays empty and this
// behaves exactly like fetching everything.
const getAllProperties = async (req, res) => {
  const { location, neighborhood, minPrice, maxPrice } = req.query;

  const andConditions = [];

  if (location) {
    andConditions.push(locationWhere("city", location));
  }

  if (neighborhood) {
    andConditions.push(locationWhere("neighborhood", neighborhood));
  }

  const where = andConditions.length ? { [Op.and]: andConditions } : {};

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }

  const properties = await Property.findAll({ where });
  res.status(200).json(properties);
};
// Get a property by its ID
const getPropertyById = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findOne({ where: { id } });

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  res.status(200).json(property);
};

// Get properties by city - not used but subject of using in future version to avoid overfetching
const getPropertiesByLocation = async (req, res) => {
  const { location } = req.body;

  const properties = await Property.findAll({
    where: locationWhere("city", location),
  });

  if (properties.length === 0) {
    return res
      .status(404)
      .json({ message: `No properties found in location: ${location}` });
  }

  res.status(200).json(properties);
};

// Get properties by agent ID
const getPropertyByAgentId = async (req, res) => {
  const { agentId } = req.params;

  const properties = await Property.findAll({
    where: { agentId },
  });

  if (properties.length === 0) {
    return res
      .status(200)
      .json({ message: `No properties found for agent ID: ${agentId}` });
  }

  res.status(200).json(properties);
};

// Create a new property - agentId comes from the authenticated user, not
// the request body, so you can't list a property under someone else's name.
const createProperty = async (req, res) => {
  const {
    price,
    location,
    description,
    size,
    imageRefs = [],
    status,
    type,
    bedrooms,
    bathrooms,
    amenities = [],
  } = req.body;

  const property = await Property.create({
    price,
    location,
    description,
    size,
    imageRefs,
    status,
    type,
    bedrooms,
    bathrooms,
    amenities,
    agentId: req.user.id,
  });

  res.status(201).json({
    message: "Property created successfully",
    property,
  });
};

// Edit an existing property - only the listing's own agent may edit it.
const editProperty = async (req, res) => {
  const { propertyId } = req.params;
  const {
    price,
    location,
    description,
    size,
    imageRefs,
    status,
    type,
    bedrooms,
    bathrooms,
    amenities,
  } = req.body;

  const property = await Property.findByPk(propertyId);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (String(property.agentId) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const updatedFields = {
    price,
    location,
    description,
    size,
    status,
    type,
    bedrooms,
    bathrooms,
    amenities,
  };

  if (imageRefs !== undefined) {
    updatedFields.imageRefs = imageRefs;
  }

  await property.update(updatedFields);

  res.status(200).json({
    message: "Property updated successfully",
    updatedProperty: property,
  });
};

// Delete a property - only the listing's own agent may delete it.
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findByPk(propertyId);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (String(property.agentId) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await property.destroy();

  res.status(200).json({ message: "Property deleted successfully" });
};

// Upload images for a property (max handled by multer in route). Multer
// writes the files to disk before this handler runs, so on any failure -
// expected (404/403) or not - we clean them back up rather than leaving
// orphaned files under someone else's property id. That cleanup is a side
// effect the global handler can't do for us, so this one keeps its own
// try/catch and forwards to next(err) instead of building the response
// itself.
const uploadPropertyImages = async (req, res, next) => {
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

    if (String(property.agentId) !== String(req.user.id)) {
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

    const updatedImages = [...(property.imageRefs || []), ...uploadedPaths];
    property.imageRefs = updatedImages.slice(0, 8); // enforce max 8
    await property.save();

    return res.status(200).json({
      message: "Images uploaded",
      imageRefs: property.imageRefs,
    });
  } catch (err) {
    cleanupUploaded();
    next(err);
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getPropertiesByLocation,
  getPropertyByAgentId,
  createProperty,
  editProperty,
  deleteProperty,
  uploadPropertyImages,
};
