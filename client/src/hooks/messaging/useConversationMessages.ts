import { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { ChatMessage } from "../../types/types";

// Owns the message thread for whichever conversation is currently selected:
// loading its messages and sending new ones. `onMessageSent` lets the
// caller refresh the conversation list (e.g. to bump ordering) after a send.
export const useConversationMessages = (
  conversationId: number | null,
  userId: string,
  onMessageSent?: () => void,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ChatMessage[]>(
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;
    try {
      const res = await axios.post<ChatMessage>(
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
    messagesEndRef,
  };
};
