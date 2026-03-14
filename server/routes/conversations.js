const express = require("express");
const router = express.Router();

const {
  startConversation,
  getConversationsByUser,
  getConversationForProperty,
  getMessagesForConversation,
  postMessage,
} = require("../controllers/conversationsController");

router.post("/start", startConversation);
router.get("/user/:userId", getConversationsByUser);
router.get("/property/:propertyId/user/:userId", getConversationForProperty);
router.get("/:conversationId/messages/:userId", getMessagesForConversation);
router.post("/:conversationId/messages", postMessage);

module.exports = router;
