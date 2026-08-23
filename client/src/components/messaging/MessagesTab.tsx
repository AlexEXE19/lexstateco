import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useConversations } from "../../hooks/messaging/useConversations";
import { useConversationMessages } from "../../hooks/messaging/useConversationMessages";
import ConversationList from "./ConversationList";
import ConversationPropertyPanel from "./ConversationPropertyPanel";
import MessageThread from "./MessageThread";
import { useTranslation } from "../../utils/i18n";

interface MessagesTabProps {
  activeConversationId: number | null;
}

const MessagesTab: React.FC<MessagesTabProps> = ({
  activeConversationId,
}) => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { t } = useTranslation();

  const {
    conversations,
    loading: loadingConversations,
    selectedId,
    setSelectedId,
    selectedConversation,
    loadConversations,
  } = useConversations(userId, activeConversationId);

  const {
    messages,
    loading: loadingMessages,
    messageText,
    setMessageText,
    sendMessage,
    messagesEndRef,
  } = useConversationMessages(selectedId, userId, loadConversations);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <ConversationList
        conversations={conversations}
        loading={loadingConversations}
        selectedId={selectedId}
        userId={userId}
        onSelect={setSelectedId}
        onRefresh={loadConversations}
      />

      <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        {!selectedConversation && (
          <div className="rounded-xl bg-white/5 p-4 text-slate-200">
            {t("account.messages.select")}
          </div>
        )}

        {selectedConversation && (
          <>
            {selectedConversation.Property && (
              <ConversationPropertyPanel
                property={selectedConversation.Property}
              />
            )}

            <MessageThread
              messages={messages}
              loading={loadingMessages}
              userId={userId}
              messageText={messageText}
              setMessageText={setMessageText}
              onSend={sendMessage}
              messagesEndRef={messagesEndRef}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;
