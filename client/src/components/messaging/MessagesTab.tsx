import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import TabHeader from "../common/TabHeader";

import { RootState } from "../../state/store";
import { useConversations } from "../../hooks/messaging/useConversations";
import { useConversationMessages } from "../../hooks/messaging/useConversationMessages";
import { useTranslation } from "../../utils/i18n";

interface MessagesTabProps {
  activeConversationId: number | null;
}

const MessagesTab: React.FC<MessagesTabProps> = ({ activeConversationId }) => {
  const currentUser = useSelector((state: RootState) => state.user);

  const { t } = useTranslation();

  const {
    conversations,
    loading: loadingConversations,
    selectedId,
    setSelectedId,
    selectedConversation,
    loadConversations,
  } = useConversations(currentUser.id, activeConversationId);

  const {
    messages,
    loading: loadingMessages,
    messageText,
    setMessageText,
    sendMessage,
    messagesEndRef,
  } = useConversationMessages(selectedId, currentUser.id, loadConversations);

  return (
    <div className="space-y-6">
      <TabHeader
        icon={MessageSquare}
        eyebrow={t("account.tabs.messages")}
        title={t("account.messages.title")}
        description={t("account.messages.subtitle")}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <ConversationList
          conversations={conversations}
          loading={loadingConversations}
          selectedId={selectedId}
          userId={currentUser.id}
          onSelect={setSelectedId}
          onRefresh={loadConversations}
        />

        <div className="border border-line bg-background-surface p-6">
          {!selectedConversation && (
            <div className="px-1 py-4 text-sm text-ink-subtle">
              {t("account.messages.select")}
            </div>
          )}

          {selectedConversation && (
            <MessageThread
              messages={messages}
              loading={loadingMessages}
              userId={currentUser.id}
              messageText={messageText}
              setMessageText={setMessageText}
              onSend={sendMessage}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
