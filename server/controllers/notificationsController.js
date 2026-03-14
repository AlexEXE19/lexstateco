const { Notification } = require("../models");

const getNotificationsByOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const notifications = await Notification.findAll({
      where: { owner_id: ownerId },
      order: [["created_at", "DESC"]],
    });

    return res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching notifications" });
  }
};

const clearNotificationsForOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    await Notification.destroy({ where: { owner_id: ownerId } });
    return res.json({ message: "Notifications cleared" });
  } catch (err) {
    console.error("Error clearing notifications:", err);
    return res
      .status(500)
      .json({ message: "Internal server error while clearing notifications" });
  }
};

const deleteNotification = async (req, res) => {
  const { ownerId, notificationId } = req.params;

  try {
    const deleted = await Notification.destroy({
      where: { id: notificationId, owner_id: ownerId },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    return res
      .status(500)
      .json({ message: "Internal server error while deleting notification" });
  }
};

module.exports = {
  getNotificationsByOwner,
  clearNotificationsForOwner,
  deleteNotification,
};
