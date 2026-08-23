import { Conversation } from "../../types/types";
import { useTranslation } from "../../utils/i18n";

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  selectedId: number | null;
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
    <div className="space-y-3 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          {t("account.group.chat")}
        </p>
        <button
          className="text-xs text-slate-300 underline"
          onClick={onRefresh}
        >
          {t("common.refresh")}
        </button>
      </div>

      {loading && (
        <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">
          {t("audience.loading")}
        </div>
      )}

      {!loading && conversations.length === 0 && (
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
              onClick={() => onSelect(conv.id)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:-translate-y-[1px] hover:ring-1 hover:ring-secondary-300/40 ${
                isActive
                  ? "bg-gradient-to-r from-secondary-600 to-cyan-500 text-white shadow-lg shadow-secondary-500/30"
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
  );
};

export default ConversationList;
