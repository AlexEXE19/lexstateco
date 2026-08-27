const express = require("express");
const router = express.Router();

const {
  getNotificationsByOwner,
  clearNotificationsForOwner,
  deleteNotification,
} = require("../controllers/notificationsController");
const { requireAuth } = require("../middlewares/auth");
const catchAsync = require("../middlewares/catchAsync");

router.use(requireAuth);

router.get("/:ownerId", catchAsync(getNotificationsByOwner));
router.delete("/:ownerId", catchAsync(clearNotificationsForOwner));
router.delete("/:ownerId/:notificationId", catchAsync(deleteNotification));

module.exports = router;
