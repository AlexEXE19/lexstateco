import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import baseURL from "../../../config/baseUrl";
import { setConversationId } from "../../../state/tab/tabSlice";
import { ConversationWithProperty } from "../../../schemas/messaging/Converstation";

// Owns the conversation list: loading it, keeping it in sync with whichever
// conversation was opened elsewhere in the app (via activeConversationId),
// and tracking the current selection.
export const useConversations = (
  userId: string,
  activeConversationId: string | null,
) => {
  const dispatch = useDispatch();
  const [conversations, setConversations] = useState<
    ConversationWithProperty[]
  >([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await axios.get<ConversationWithProperty[]>(
        `${baseURL}/conversations/user/${userId}`,
      );
      setConversations(res.data || []);
    } catch (err) {
      console.error("Error loading conversations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [userId]);

  useEffect(() => {
    if (!activeConversationId) return;
    setSelectedId(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    if (selectedId) {
      dispatch(setConversationId(selectedId));
    }
  }, [selectedId, dispatch]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId],
  );

  return {
    conversations,
    loading,
    selectedId,
    setSelectedId,
    selectedConversation,
    loadConversations,
  };
};
