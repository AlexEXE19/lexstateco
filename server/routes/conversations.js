const express = require("express");
const router = express.Router();

const {
  startConversation,
  getConversationsByUser,
  getConversationForProperty,
  getMessagesForConversation,
  postMessage,
} = require("../controllers/conversationsController");
const { requireAuth } = require("../middlewares/auth");
const catchAsync = require("../middlewares/catchAsync");

router.use(requireAuth);

router.post("/start", catchAsync(startConversation));
router.get("/user/:userId", catchAsync(getConversationsByUser));
router.get(
  "/property/:propertyId/user/:userId",
  catchAsync(getConversationForProperty),
);
router.get(
  "/:conversationId/messages/:userId",
  catchAsync(getMessagesForConversation),
);
router.post("/:conversationId/messages", catchAsync(postMessage));

module.exports = router;
