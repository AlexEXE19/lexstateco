const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
  getAllProperties,
  getPropertyById,
  getPropertiesByLocation,
  getPropertyBySellerId,
  createProperty,
  editProperty,
  deleteProperty,
  uploadPropertyImages,
} = require("../controllers/propertyController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const propertyId = req.params.propertyId;
    const dest = path.join(
      __dirname,
      "../uploads/property",
      String(propertyId),
    );
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { files: 8, fileSize: 10 * 1024 * 1024 },
});

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

// Route to upload images for a property (max 8 images)
router.post(
  "/:propertyId/images",
  upload.array("images", 8),
  uploadPropertyImages,
);

module.exports = router;
