const express = require("express");
const router = express.Router();

const {
  createTourRequest,
  updateTourRequestStatus,
  getTourRequestsByRequester,
  getTourRequestsBySeller,
  getTourRequestByRequesterAndProperty,
} = require("../controllers/tourRequestController");

// Create new tour request
router.post("/", createTourRequest);

// Get all tour requests for a requester
router.get("/requester/:requesterId", getTourRequestsByRequester);

// Get all tour requests for a seller (incoming)
router.get("/seller/:sellerId", getTourRequestsBySeller);

// Get latest tour request for requester + property
router.get(
  "/requester/:requesterId/property/:propertyId",
  getTourRequestByRequesterAndProperty,
);

// Update status for a tour request
router.put("/:id/status", updateTourRequestStatus);

module.exports = router;
