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

// Renders as a fragment (no wrapping element) so it can share a column
// with TourRequestPanel in the detail page sidebar.
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
        className="btn-secondary w-full"
      >
        {t("account.messages.messageOwner")}
      </button>
      {showCompose && (
        <div className="mt-3 space-y-3 border border-line p-4">
          <p className="eyebrow">
            {t("account.messages.firstMessage")}
          </p>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={3}
            className="field resize-none"
            placeholder={t("account.messages.inputPlaceholder")}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onSend}
              disabled={messageStatus === "loading"}
              className="btn-primary py-2"
            >
              {messageStatus === "loading"
                ? t("properties.sending")
                : (t("account.messages.send") ?? "Send")}
            </button>
            <button
              onClick={onCancel}
              className="btn-quiet"
            >
              {t("common.cancel") ?? "Cancel"}
            </button>
          </div>
          {messageStatus === "error" && (
            <p className="text-xs text-rose-600">
              {t("properties.errorAuth")}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default MessageComposer;
