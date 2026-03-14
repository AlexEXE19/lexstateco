const express = require("express");
const router = express.Router();

const {
  getNotificationsByOwner,
  clearNotificationsForOwner,
  deleteNotification,
} = require("../controllers/notificationsController");

router.get("/:ownerId", getNotificationsByOwner);
router.delete("/:ownerId", clearNotificationsForOwner);
router.delete("/:ownerId/:notificationId", deleteNotification);

module.exports = router;
