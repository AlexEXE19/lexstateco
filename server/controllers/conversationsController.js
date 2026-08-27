const {
  Conversation,
  Message,
  Property,
  Notification,
  User,
} = require("../models");
const { assertSelf } = require("../middlewares/auth");

const ensureParticipant = (conversation, userId) => {
  return (
    conversation &&
    (Number(conversation.buyer_id) === Number(userId) ||
      Number(conversation.seller_id) === Number(userId))
  );
};

// Best-effort: a failed notification insert shouldn't fail the message
// send itself, so this stays local and swallows its own errors instead of
// going through the global handler.
const notifyMessage = async ({ conversation, senderId, content }) => {
  try {
    const recipientId =
      Number(conversation.buyer_id) === Number(senderId)
        ? conversation.seller_id
        : conversation.buyer_id;

    const property = await Property.findByPk(conversation.property_id);
    const propertyTitle = property?.title || "the property";

    await Notification.create({
      owner_id: recipientId,
      title: "New message",
      description: `You received a message about ${propertyTitle}.`,
      type: "message",
    });
  } catch (err) {
    console.error("Failed to create message notification", err);
  }
};

const startConversation = async (req, res) => {
  const { propertyId, content } = req.body;
  const senderId = req.user.id;

  if (!propertyId) {
    return res.status(400).json({ message: "propertyId is required" });
  }

  const property = await Property.findByPk(propertyId);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (Number(property.seller_id) === Number(senderId)) {
    return res.status(400).json({ message: "Owner cannot start chat" });
  }

  let conversation = await Conversation.findOne({
    where: { property_id: propertyId, buyer_id: senderId },
    include: [{ model: Property }],
  });

  if (!conversation && !content) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content required to start chat" });
  }

  if (!conversation) {
    conversation = await Conversation.create({
      property_id: propertyId,
      buyer_id: senderId,
      seller_id: property.seller_id,
    });
    conversation = await Conversation.findByPk(conversation.id, {
      include: [{ model: Property }],
    });
  }

  let message = null;
  if (content) {
    message = await Message.create({
      conversation_id: conversation.id,
      sender_id: senderId,
      content,
    });
    await notifyMessage({ conversation, senderId, content });
  }

  return res.status(201).json({ conversation, message, created: true });
};

const getConversationsByUser = async (req, res) => {
  const { userId } = req.params;
  if (!assertSelf(req, res, userId)) return;

  const conversations = await Conversation.findAll({
    where: {
      [require("sequelize").Op.or]: [
        { buyer_id: userId },
        { seller_id: userId },
      ],
    },
    include: [{ model: Property }],
    order: [["updated_at", "DESC"]],
  });

  return res.json(conversations);
};

const getConversationForProperty = async (req, res) => {
  const { propertyId, userId } = req.params;
  if (!assertSelf(req, res, userId)) return;

  const conversation = await Conversation.findOne({
    where: { property_id: propertyId, buyer_id: userId },
    include: [{ model: Property }],
  });

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  return res.json(conversation);
};

const getMessagesForConversation = async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findByPk(conversationId);
  if (!ensureParticipant(conversation, req.user.id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const messages = await Message.findAll({
    where: { conversation_id: conversationId },
    order: [["created_at", "ASC"]],
  });

  return res.json(messages);
};

const postMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  const senderId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "content is required" });
  }

  const conversation = await Conversation.findByPk(conversationId);
  if (!ensureParticipant(conversation, senderId)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const message = await Message.create({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
  });

  await Conversation.update(
    { updated_at: new Date() },
    { where: { id: conversationId } },
  );

  await notifyMessage({ conversation, senderId, content });

  return res.status(201).json(message);
};

module.exports = {
  startConversation,
  getConversationsByUser,
  getConversationForProperty,
  getMessagesForConversation,
  postMessage,
};
