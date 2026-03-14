import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "../state/store";
import baseURL from "../config/baseUrl";
import { Conversation, ChatMessage, Property } from "../types/types";
import { setConversationId } from "../state/tab/tabSlice";
import Map from "./Map";
import { useTranslation } from "../utils/i18n";

interface MessagesTabProps {
  activeConversationId: number | null;
}

const formatTime = (value: string) => {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
};

const MessagesTab: React.FC<MessagesTabProps> = ({ activeConversationId }) => {
  const userId = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId],
  );

  const property: Property | undefined = selectedConversation?.Property;

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await axios.get<Conversation[]>(
        `${baseURL}/conversations/user/${userId}`,
      );
      setConversations(res.data || []);
    } catch (err) {
      console.error("Error loading conversations", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      setLoadingMessages(true);
      const res = await axios.get<ChatMessage[]>(
        `${baseURL}/conversations/${conversationId}/messages/${userId}`,
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error loading messages", err);
    } finally {
      setLoadingMessages(false);
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
      loadMessages(selectedId);
      dispatch(setConversationId(selectedId));
    }
  }, [selectedId, dispatch]);

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedId) return;
    try {
      const res = await axios.post<ChatMessage>(
        `${baseURL}/conversations/${selectedId}/messages`,
        {
          senderId: Number(userId),
          content: messageText.trim(),
        },
      );
      setMessages((prev) => [...prev, res.data]);
      setMessageText("");
      loadConversations();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            {t("account.group.chat")}
          </p>
          <button
            className="text-xs text-slate-300 underline"
            onClick={loadConversations}
          >
            {t("common.refresh")}
          </button>
        </div>

        {loadingConversations && (
          <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">
            {t("audience.loading")}
          </div>
        )}

        {!loadingConversations && conversations.length === 0 && (
          <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">
            {t("account.messages.empty")}
          </div>
        )}

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {conversations.map((conv) => {
            const isActive = conv.id === selectedId;
            const role =
              Number(conv.sellerId) === Number(userId)
                ? t("account.messages.role.seller")
                : t("account.messages.role.buyer");
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:-translate-y-[1px] hover:ring-1 hover:ring-sky-300/40 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30"
                    : "bg-white/5 text-slate-100 ring-1 ring-white/10"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {conv.Property?.title || t("account.tabs.list")}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-slate-300">
                    {role}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        {!selectedConversation && (
          <div className="rounded-xl bg-white/5 p-4 text-slate-200">
            {t("account.messages.select")}
          </div>
        )}

        {selectedConversation && (
          <>
            {property && (
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="flex w-full items-center justify-between bg-slate-900/60 px-4 py-3 text-left text-slate-100"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {t("properties.details")}
                    </p>
                    <p className="text-lg font-semibold">{property.title}</p>
                    <p className="text-sm text-slate-300">
                      {property.location}
                    </p>
                  </div>
                  <span className="text-xs text-blue-200 underline">
                    {showDetails ? t("common.hide") : t("common.show")}
                  </span>
                </button>
                {showDetails && (
                  <div className="grid gap-4 bg-slate-900/80 p-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-2">
                      <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                        <img
                          src={
                            property.imageRefs?.[0]
                              ? `${baseURL.replace(/\/$/, "")}/${property.imageRefs[0]}`
                              : "/default_house.jpg"
                          }
                          alt={property.title}
                          className="h-52 w-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-slate-200">
                        {property.description}
                      </p>
                    </div>
                    <div className="h-52 overflow-hidden rounded-xl ring-1 ring-white/10">
                      <Map
                        location={property.location}
                        label={property.title}
                        zoom={12}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex h-[50vh] flex-col gap-3 overflow-hidden rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {loadingMessages && (
                  <div className="text-sm text-slate-300">
                    {t("audience.loading")}
                  </div>
                )}
                {!loadingMessages &&
                  messages.map((msg) => {
                    const mine = Number(msg.senderId) === Number(userId);
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${
                            mine
                              ? "bg-blue-600 text-white shadow-blue-500/30"
                              : "bg-white/10 text-white shadow-black/20"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("account.messages.inputPlaceholder")}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={sendMessage}
                  className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
                >
                  {t("account.messages.send")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;
