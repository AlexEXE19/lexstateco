const { TourRequest, Property } = require("../models");
const { User } = require("../models");

// Create a tour request
const createTourRequest = async (req, res) => {
  try {
    const { propertyId, sellerId, requesterId, requestedAt, status } = req.body;

    if (!propertyId || !sellerId || !requesterId || !requestedAt) {
      return res.status(400).json({
        message: "propertyId, sellerId, requesterId, requestedAt are required",
      });
    }

    const tourRequest = await TourRequest.create({
      property_id: propertyId,
      seller_id: sellerId,
      requester_id: requesterId,
      requested_at: requestedAt,
      status: status || "pending",
    });

    const withProperty = await TourRequest.findByPk(tourRequest.id, {
      include: [{ model: Property }],
    });

    return res
      .status(201)
      .json({ message: "Tour request created", tourRequest: withProperty });
  } catch (err) {
    console.error("Error creating tour request:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update status for a tour request (cancel, accept, reject)
const updateTourRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const allowed = ["pending", "accepted", "rejected", "canceled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Use pending, accepted, rejected, or canceled.",
      });
    }

    const [updated] = await TourRequest.update({ status }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: "Tour request not found" });
    }

    const refreshed = await TourRequest.findByPk(id, {
      include: [{ model: Property }],
    });
    return res.json({ message: "Status updated", tourRequest: refreshed });
  } catch (err) {
    console.error("Error updating tour request status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get tour requests for a requester
const getTourRequestsByRequester = async (req, res) => {
  try {
    const { requesterId } = req.params;

    const requests = await TourRequest.findAll({
      where: { requester_id: requesterId },
      order: [["requested_at", "DESC"]],
      include: [{ model: Property }],
    });

    return res.json(requests);
  } catch (err) {
    console.error("Error fetching tour requests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get tour requests for a seller (incoming)
const getTourRequestsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const requests = await TourRequest.findAll({
      where: { seller_id: sellerId },
      order: [["requested_at", "DESC"]],
      include: [
        { model: Property },
        {
          model: User,
          as: "requester",
          attributes: ["id", "first_name", "last_name", "email", "phone"],
        },
      ],
    });

    return res.json(requests);
  } catch (err) {
    console.error("Error fetching incoming tour requests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single tour request by requester and property (latest)
const getTourRequestByRequesterAndProperty = async (req, res) => {
  try {
    const { requesterId, propertyId } = req.params;

    const request = await TourRequest.findOne({
      where: { requester_id: requesterId, property_id: propertyId },
      order: [["requested_at", "DESC"]],
      include: [{ model: Property }],
    });

    if (!request) {
      return res.status(404).json({ message: "No tour request found" });
    }

    return res.json(request);
  } catch (err) {
    console.error("Error fetching tour request:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTourRequest,
  updateTourRequestStatus,
  getTourRequestsByRequester,
  getTourRequestsBySeller,
  getTourRequestByRequesterAndProperty,
};
