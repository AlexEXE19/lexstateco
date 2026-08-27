const {
  TourRequest,
  Property,
  Notification,
  User,
  Conversation,
} = require("../models");
const { assertSelf } = require("../middlewares/auth");

// Best-effort: a failed notification insert shouldn't fail the tour
// request itself, so this stays local and swallows its own errors instead
// of going through the global handler.
const createNotificationSafe = async ({
  ownerId,
  title,
  description,
  type,
}) => {
  try {
    await Notification.create({
      owner_id: ownerId,
      title,
      description,
      type,
    });
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Create a tour request - the requester is always the authenticated user;
// the seller is looked up from the property rather than trusted from the
// client, so you can't file a request that notifies the wrong seller.
const createTourRequest = async (req, res) => {
  const { propertyId, requestedAt, status } = req.body;
  const requesterId = req.user.id;

  if (!propertyId || !requestedAt) {
    return res.status(400).json({
      message: "propertyId and requestedAt are required",
    });
  }

  const property = await Property.findByPk(propertyId);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  const tourRequest = await TourRequest.create({
    property_id: propertyId,
    seller_id: property.seller_id,
    requester_id: requesterId,
    requested_at: requestedAt,
    status: status || "pending",
  });

  // A tour request implies you're going to want to talk to the seller, so
  // start (or reuse) the conversation for this property right away instead
  // of making the requester separately click "Message owner" too.
  await Conversation.findOrCreate({
    where: { property_id: propertyId, buyer_id: requesterId },
    defaults: { seller_id: property.seller_id },
  });

  const withProperty = await TourRequest.findByPk(tourRequest.id, {
    include: [{ model: Property }],
  });

  const propertyTitle = withProperty?.Property?.title || "your property";
  await createNotificationSafe({
    ownerId: property.seller_id,
    title: "New tour request",
    description: `You have a new tour request for ${propertyTitle}.`,
    type: "incoming_request",
  });

  return res
    .status(201)
    .json({ message: "Tour request created", tourRequest: withProperty });
};

// Update status for a tour request (cancel, accept, reject) - only the
// requester may cancel, and only the seller may accept/reject.
const updateTourRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  const allowed = ["pending", "accepted", "rejected", "canceled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Use pending, accepted, rejected, or canceled.",
    });
  }

  const request = await TourRequest.findByPk(id, {
    include: [
      { model: Property },
      {
        model: User,
        as: "requester",
        attributes: ["id", "first_name", "last_name"],
      },
    ],
  });

  if (!request) {
    return res.status(404).json({ message: "Tour request not found" });
  }

  const isSeller = String(request.seller_id) === String(req.user.id);
  const isRequester = String(request.requester_id) === String(req.user.id);
  const sellerOnlyStatus = status === "accepted" || status === "rejected";
  const requesterOnlyStatus = status === "canceled";

  if (
    (sellerOnlyStatus && !isSeller) ||
    (requesterOnlyStatus && !isRequester) ||
    (!sellerOnlyStatus && !requesterOnlyStatus && !isSeller && !isRequester)
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  request.status = status;
  await request.save();

  const propertyTitle = request?.Property?.title || "your property";
  await createNotificationSafe({
    ownerId: request.requester_id,
    title: "Tour request updated",
    description: `Status for ${propertyTitle} changed to ${status}.`,
    type: "request_update",
  });

  return res.json({ message: "Status updated", tourRequest: request });
};

// Get tour requests for a requester
const getTourRequestsByRequester = async (req, res) => {
  const { requesterId } = req.params;
  if (!assertSelf(req, res, requesterId)) return;

  const requests = await TourRequest.findAll({
    where: { requester_id: requesterId },
    order: [["requested_at", "DESC"]],
    include: [{ model: Property }],
  });

  return res.json(requests);
};

// Get tour requests for a seller (incoming)
const getTourRequestsBySeller = async (req, res) => {
  const { sellerId } = req.params;
  if (!assertSelf(req, res, sellerId)) return;

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
};

// Get a single tour request by requester and property (latest)
const getTourRequestByRequesterAndProperty = async (req, res) => {
  const { requesterId, propertyId } = req.params;
  if (!assertSelf(req, res, requesterId)) return;

  const request = await TourRequest.findOne({
    where: { requester_id: requesterId, property_id: propertyId },
    order: [["requested_at", "DESC"]],
    include: [{ model: Property }],
  });

  if (!request) {
    return res.status(404).json({ message: "No tour request found" });
  }

  return res.json(request);
};

module.exports = {
  createTourRequest,
  updateTourRequestStatus,
  getTourRequestsByRequester,
  getTourRequestsBySeller,
  getTourRequestByRequesterAndProperty,
};
