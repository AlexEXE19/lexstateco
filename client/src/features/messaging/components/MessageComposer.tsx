import { useTranslation } from "../../../utils/i18n";
import {
  MessageStatus,
  useConversationCompose,
} from "../hooks/useConversationCompose";
import { Property } from "../../../schemas/property/Property";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";

interface MessageComposerProps {
  property: Property;
}

// Renders as a fragment (no wrapping element) so it can share a column
// with TourRequestPanel in the detail page sidebar.
const MessageComposer: React.FC<MessageComposerProps> = ({ property }) => {
  const { t } = useTranslation();

  const currentUser = useSelector((state: RootState) => state.user);

  const {
    showMessageCompose,
    setShowMessageCompose,
    messageText,
    setMessageText,
    messageStatus,
    handleMessageClick,
    handleSendFirstMessage,
  } = useConversationCompose(property, currentUser);

  return (
    <>
      <button onClick={handleMessageClick} className="btn-secondary w-full">
        {t("account.messages.messageOwner")}
      </button>
      {showMessageCompose && (
        <div className="mt-3 space-y-3 border border-line p-4">
          <p className="eyebrow">{t("account.messages.firstMessage")}</p>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={3}
            className="field resize-none"
            placeholder={t("account.messages.inputPlaceholder")}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendFirstMessage}
              disabled={messageStatus === "loading"}
              className="btn-primary py-2"
            >
              {messageStatus === "loading"
                ? t("properties.sending")
                : (t("account.messages.send") ?? "Send")}
            </button>
            <button
              onClick={() => {
                setShowMessageCompose(false);
              }}
              className="btn-quiet"
            >
              {t("common.cancel") ?? "Cancel"}
            </button>
          </div>
          {messageStatus === "error" && (
            <p className="text-xs text-rose-600">{t("properties.errorAuth")}</p>
          )}
        </div>
      )}
    </>
  );
};

export default MessageComposer;
