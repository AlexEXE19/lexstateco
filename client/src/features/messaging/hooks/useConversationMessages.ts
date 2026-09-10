import { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseURL from "../../../config/baseUrl";
import { Message } from "../../../schemas/messaging/Message";

// Owns the message thread for whichever conversation is currently selected:
// loading its messages and sending new ones. `onMessageSent` lets the
// caller refresh the conversation list (e.g. to bump ordering) after a send.
export const useConversationMessages = (
  conversationId: string | null,
  userId: string,
  onMessageSent?: () => void,
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Message[]>(
          `${baseURL}/conversations/${conversationId}/messages/${userId}`,
        );
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error loading messages", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, userId]);

  const sendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;
    try {
      const res = await axios.post<Message>(
        `${baseURL}/conversations/${conversationId}/messages`,
        {
          senderId: Number(userId),
          content: messageText.trim(),
        },
      );
      setMessages((prev) => [...prev, res.data]);
      setMessageText("");
      onMessageSent?.();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return {
    messages,
    loading,
    messageText,
    setMessageText,
    sendMessage,
  };
};
