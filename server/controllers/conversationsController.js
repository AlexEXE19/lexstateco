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
    (Number(conversation.buyerId) === Number(userId) ||
      Number(conversation.agentId) === Number(userId))
  );
};

// Best-effort: a failed notification insert shouldn't fail the message
// send itself, so this stays local and swallows its own errors instead of
// going through the global handler.
const notifyMessage = async ({ conversation, senderId, content }) => {
  try {
    const recipientId =
      Number(conversation.buyerId) === Number(senderId)
        ? conversation.agentId
        : conversation.buyerId;

    await Notification.create({
      ownerId: recipientId,
      title: "New message",
      description: "You received a message about the property.",
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

  if (Number(property.agentId) === Number(senderId)) {
    return res.status(400).json({ message: "Owner cannot start chat" });
  }

  let conversation = await Conversation.findOne({
    where: { propertyId, buyerId: senderId },
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
      propertyId,
      buyerId: senderId,
      agentId: property.agentId,
    });
    conversation = await Conversation.findByPk(conversation.id, {
      include: [{ model: Property }],
    });
  }

  let message = null;
  if (content) {
    message = await Message.create({
      conversationId: conversation.id,
      senderId,
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
        { buyerId: userId },
        { agentId: userId },
      ],
    },
    include: [{ model: Property }],
    order: [["updatedAt", "DESC"]],
  });

  return res.json(conversations);
};

const getConversationForProperty = async (req, res) => {
  const { propertyId, userId } = req.params;
  if (!assertSelf(req, res, userId)) return;

  const conversation = await Conversation.findOne({
    where: { propertyId, buyerId: userId },
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
    where: { conversationId },
    order: [["createdAt", "ASC"]],
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
    conversationId,
    senderId,
    content,
  });

  await Conversation.update(
    { updatedAt: new Date() },
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
