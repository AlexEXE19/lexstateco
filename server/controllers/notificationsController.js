const { Notification } = require("../models");
const { assertSelf } = require("../middlewares/auth");

const getNotificationsByOwner = async (req, res) => {
  const { ownerId } = req.params;
  if (!assertSelf(req, res, ownerId)) return;

  const notifications = await Notification.findAll({
    where: { owner_id: ownerId },
    order: [["created_at", "DESC"]],
  });

  return res.json(notifications);
};

const clearNotificationsForOwner = async (req, res) => {
  const { ownerId } = req.params;
  if (!assertSelf(req, res, ownerId)) return;

  await Notification.destroy({ where: { owner_id: ownerId } });
  return res.json({ message: "Notifications cleared" });
};

const deleteNotification = async (req, res) => {
  const { ownerId, notificationId } = req.params;
  if (!assertSelf(req, res, ownerId)) return;

  const deleted = await Notification.destroy({
    where: { id: notificationId, owner_id: ownerId },
  });

  if (!deleted) {
    return res.status(404).json({ message: "Notification not found" });
  }

  return res.json({ message: "Notification deleted" });
};

module.exports = {
  getNotificationsByOwner,
  clearNotificationsForOwner,
  deleteNotification,
};
