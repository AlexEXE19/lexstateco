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
      ownerId,
      title,
      description,
      type,
    });
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Create a tour request - the requester is always the authenticated user;
// the agent is looked up from the property rather than trusted from the
// client, so you can't file a request that notifies the wrong agent.
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
    propertyId,
    agentId: property.agentId,
    requesterId,
    requestedAt,
    status: status || "pending",
  });

  // A tour request implies you're going to want to talk to the agent, so
  // start (or reuse) the conversation for this property right away instead
  // of making the requester separately click "Message owner" too.
  await Conversation.findOrCreate({
    where: { propertyId, buyerId: requesterId },
    defaults: { agentId: property.agentId },
  });

  const withProperty = await TourRequest.findByPk(tourRequest.id, {
    include: [{ model: Property }],
  });

  await createNotificationSafe({
    ownerId: property.agentId,
    title: "New tour request",
    description: "You have a new tour request for your property.",
    type: "incomingRequest",
  });

  return res
    .status(201)
    .json({ message: "Tour request created", tourRequest: withProperty });
};

// Update status for a tour request (cancel, accept, reject) - only the
// requester may cancel, and only the agent may accept/reject.
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
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!request) {
    return res.status(404).json({ message: "Tour request not found" });
  }

  const isAgent = String(request.agentId) === String(req.user.id);
  const isRequester = String(request.requesterId) === String(req.user.id);
  const agentOnlyStatus = status === "accepted" || status === "rejected";
  const requesterOnlyStatus = status === "canceled";

  if (
    (agentOnlyStatus && !isAgent) ||
    (requesterOnlyStatus && !isRequester) ||
    (!agentOnlyStatus && !requesterOnlyStatus && !isAgent && !isRequester)
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  request.status = status;
  await request.save();

  await createNotificationSafe({
    ownerId: request.requesterId,
    title: "Tour request updated",
    description: `Status for your tour request changed to ${status}.`,
    type: "requestUpdate",
  });

  return res.json({ message: "Status updated", tourRequest: request });
};

// Get tour requests for a requester
const getTourRequestsByRequester = async (req, res) => {
  const { requesterId } = req.params;
  if (!assertSelf(req, res, requesterId)) return;

  const requests = await TourRequest.findAll({
    where: { requesterId },
    order: [["requestedAt", "DESC"]],
    include: [{ model: Property }],
  });

  return res.json(requests);
};

// Get tour requests for an agent (incoming)
const getTourRequestsByAgent = async (req, res) => {
  const { agentId } = req.params;
  if (!assertSelf(req, res, agentId)) return;

  const requests = await TourRequest.findAll({
    where: { agentId },
    order: [["requestedAt", "DESC"]],
    include: [
      { model: Property },
      {
        model: User,
        as: "requester",
        attributes: ["id", "firstName", "lastName", "email", "phone"],
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
    where: { requesterId, propertyId },
    order: [["requestedAt", "DESC"]],
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
  getTourRequestsByAgent,
  getTourRequestByRequesterAndProperty,
};
