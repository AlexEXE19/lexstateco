import { ChatMessage } from "../../types/types";
import { useTranslation } from "../../utils/i18n";

const formatTime = (value: string) => {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
};

interface MessageThreadProps {
  messages: ChatMessage[];
  loading: boolean;
  userId: string;
  messageText: string;
  setMessageText: (value: string) => void;
  onSend: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  loading,
  userId,
  messageText,
  setMessageText,
  onSend,
  messagesEndRef,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-[50vh] flex-col gap-3 overflow-hidden rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {loading && (
          <div className="text-sm text-slate-300">
            {t("audience.loading")}
          </div>
        )}
        {!loading &&
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
          onClick={onSend}
          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
        >
          {t("account.messages.send")}
        </button>
      </div>
    </div>
  );
};

export default MessageThread;
