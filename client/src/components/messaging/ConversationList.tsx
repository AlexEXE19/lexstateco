import { Conversation } from "../../schemas/Converstation";
import { useTranslation } from "../../utils/i18n";

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  selectedId: string | null;
  userId: string;
  onSelect: (id: number) => void;
  onRefresh: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading,
  selectedId,
  userId,
  onSelect,
  onRefresh,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 border border-line bg-background-surface p-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow">
          {t("account.group.chat")}
        </p>
        <button
          className="text-xs text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          onClick={onRefresh}
        >
          {t("common.refresh")}
        </button>
      </div>

      {loading && (
        <div className="px-1 py-3 text-sm text-ink-subtle">
          {t("audience.loading")}
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="px-1 py-3 text-sm text-ink-subtle">
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
              onClick={() => onSelect(conv.id)}
              className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                isActive
                  ? "border-primary-200 bg-primary-50"
                  : "border-line hover:bg-background-elevated"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">
                  {conv.Property?.title || t("account.tabs.list")}
                </span>
                <span className="mt-0.5 text-[11px] uppercase tracking-label text-ink-subtle">
                  {role}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
