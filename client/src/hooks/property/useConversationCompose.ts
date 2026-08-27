import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { Property, User } from "../../types/types";
import { setTab } from "../../state/tab/tabSlice";
import { useFeedbackPrompt } from "../useFeedbackPrompt";

export type MessageStatus = "idle" | "loading" | "error";

// Owns "message the seller about this property": checking for an existing
// conversation, composing the first message when there isn't one, and
// routing into the Messages tab once a conversation exists.
export const useConversationCompose = (
  selectedProperty: Property | null,
  currentUser: User,
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { promptForFeedback } = useFeedbackPrompt();
  const [showMessageCompose, setShowMessageCompose] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageStatus, setMessageStatus] = useState<MessageStatus>("idle");

  useEffect(() => {
    setShowMessageCompose(false);
    setMessageText("");
    setMessageStatus("idle");
  }, [selectedProperty?.id]);

  const goToConversation = (conversationId: number | null) => {
    dispatch(setTab({ type: "messages", conversationId }));
    navigate("/account");
  };

  const handleMessageClick = async () => {
    if (!selectedProperty) return;
    if (!currentUser || currentUser.id === "-1") {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `${baseURL}/conversations/property/${selectedProperty.id}/user/${currentUser.id}`,
      );
      goToConversation(res.data.id);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setShowMessageCompose(true);
      } else {
        console.error("Error checking conversation", err);
      }
    }
  };

  const handleSendFirstMessage = async () => {
    if (!selectedProperty) return;
    if (!messageText.trim()) return;
    setMessageStatus("loading");
    try {
      const res = await axios.post(`${baseURL}/conversations/start`, {
        propertyId: selectedProperty.id,
        senderId: Number(currentUser.id),
        content: messageText.trim(),
      });
      setMessageStatus("idle");
      setShowMessageCompose(false);
      setMessageText("");
      goToConversation(res.data.conversation.id);
      promptForFeedback();
    } catch (err) {
      console.error("Error starting conversation", err);
      setMessageStatus("error");
    }
  };

  return {
    showMessageCompose,
    setShowMessageCompose,
    messageText,
    setMessageText,
    messageStatus,
    handleMessageClick,
    handleSendFirstMessage,
  };
};
