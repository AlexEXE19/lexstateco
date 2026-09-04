const express = require("express");
const router = express.Router();

const {
  createTourRequest,
  updateTourRequestStatus,
  getTourRequestsByRequester,
  getTourRequestsByAgent,
  getTourRequestByRequesterAndProperty,
} = require("../controllers/tourRequestController");
const { requireAuth } = require("../middlewares/auth");
const catchAsync = require("../middlewares/catchAsync");

router.use(requireAuth);

// Create new tour request
router.post("/", catchAsync(createTourRequest));

// Get all tour requests for a requester
router.get("/requester/:requesterId", catchAsync(getTourRequestsByRequester));

// Get all tour requests for an agent (incoming)
router.get("/agent/:agentId", catchAsync(getTourRequestsByAgent));

// Get latest tour request for requester + property
router.get(
  "/requester/:requesterId/property/:propertyId",
  catchAsync(getTourRequestByRequesterAndProperty),
);

// Update status for a tour request
router.put("/:id/status", catchAsync(updateTourRequestStatus));

module.exports = router;
