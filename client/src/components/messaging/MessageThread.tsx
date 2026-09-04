import { Message } from "../../schemas/Message";
import { useTranslation } from "../../utils/i18n";

const formatTime = (date: Date | string) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};
interface MessageThreadProps {
  messages: Message[];
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
    <div className="flex h-[55vh] flex-col gap-4 overflow-hidden border border-line bg-background-surface p-4">
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {loading && (
          <div className="text-sm text-ink-subtle">{t("audience.loading")}</div>
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
                  className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm ${
                    mine
                      ? "bg-primary-800 text-white"
                      : "bg-background-elevated text-ink"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`mt-1.5 text-[10px] uppercase tracking-label ${mine ? "text-primary-200" : "text-ink-subtle"}`}>
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
          className="field flex-1"
        />
        <button
          onClick={onSend}
          className="btn-primary"
        >
          {t("account.messages.send")}
        </button>
      </div>
    </div>
  );
};

export default MessageThread;
