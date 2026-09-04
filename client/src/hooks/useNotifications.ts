import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../config/baseUrl";
import { Notification } from "../schemas/Notification";

export const formatTimeAgo = (timestamp: string) => {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = Math.max(0, now - then);

  const minutes = Math.floor(diffMs / 60000);
  if (minutes <= 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(days / 365);
  return `${years}y`;
};

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!userId || userId === "-1") {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get<Notification[]>(
        `${baseURL}/notifications/${userId}`,
      );
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const clearNotifications = useCallback(async () => {
    if (!userId || userId === "-1") {
      setNotifications([]);
      return;
    }

    try {
      await axios.delete(`${baseURL}/notifications/${userId}`);
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications", err);
    }
  }, [userId]);

  const deleteNotification = useCallback(
    async (notificationId: number) => {
      if (!userId || userId === "-1") return;
      try {
        await axios.delete(
          `${baseURL}/notifications/${userId}/${notificationId}`,
        );
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      } catch (err) {
        console.error("Error deleting notification", err);
      }
    },
    [userId],
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    loadNotifications,
    clearNotifications,
    deleteNotification,
  };
};
