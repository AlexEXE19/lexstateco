import { useTranslation } from "../../utils/i18n";
import { MessageStatus } from "../../hooks/property/useConversationCompose";

interface MessageComposerProps {
  showCompose: boolean;
  messageText: string;
  setMessageText: (value: string) => void;
  messageStatus: MessageStatus;
  onMessageClick: () => void;
  onSend: () => void;
  onCancel: () => void;
}

// Renders as a fragment (no wrapping element) since it shares a flex column
// with TourRequestPanel inside PropertyDetailPanel.
const MessageComposer: React.FC<MessageComposerProps> = ({
  showCompose,
  messageText,
  setMessageText,
  messageStatus,
  onMessageClick,
  onSend,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={onMessageClick}
        className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/20"
      >
        {t("account.messages.messageOwner")}
      </button>
      {showCompose && (
        <div className="mt-3 space-y-2 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {t("account.messages.firstMessage")}
          </p>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={t("account.messages.inputPlaceholder")}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onSend}
              disabled={messageStatus === "loading"}
              className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400 disabled:opacity-70"
            >
              {messageStatus === "loading"
                ? t("properties.sending")
                : (t("account.messages.send") ?? "Send")}
            </button>
            <button
              onClick={onCancel}
              className="text-sm text-slate-200 underline"
            >
              {t("common.cancel") ?? "Cancel"}
            </button>
          </div>
          {messageStatus === "error" && (
            <p className="text-xs text-rose-300">
              {t("properties.errorAuth")}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default MessageComposer;
