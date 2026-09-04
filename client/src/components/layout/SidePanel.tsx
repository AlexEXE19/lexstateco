import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  ClipboardList,
  Home,
  Building2,
  Users,
  MessageSquare,
  LogOut,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { RootState } from "../../state/store";
import { toggle } from "../../state/sidePanel/sidePanelSlice";
import { useTranslation } from "../../utils/i18n";

const SidePanel: React.FC = () => {
  const isPanelOpen = useSelector((state: RootState) => state.sidePanel.isOpen);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const navigate = useNavigate();
  const navGroups = useMemo(
    () => [
      {
        title: t("account.group.buyer"),
        items: [
          {
            key: "saved",
            label: t("account.tabs.saved"),
            icon: Heart,
            path: "/saved",
          },
          {
            key: "requests",
            label: t("account.tabs.requests"),
            icon: ClipboardList,
            path: "/requests",
          },
        ],
      },
      {
        title: t("account.group.seller"),
        items: [
          {
            key: "myProperties",
            label: t("account.tabs.myProperties"),
            icon: Building2,
            path: "/my-properties",
          },
          {
            key: "list",
            label: t("account.tabs.list"),
            icon: Home,
            path: "/list-property",
          },
          {
            key: "audience",
            label: t("account.tabs.audience"),
            icon: Users,
            path: "/audience",
          },
        ],
      },
      {
        title: t("account.group.chat"),
        items: [
          {
            key: "messages",
            label: t("account.tabs.messages"),
            icon: MessageSquare,
            path: "/messages",
          },
        ],
      },
    ],
    [t],
  );

  return (
    <>
      {isPanelOpen && (
        <div className="fixed z-20 right-0 top-0 h-full bg-slate-900 p-6 shadow-xl ring-1 ring-white/10 transition-all duration-200">
          {/* Side panel toggle */}
          <button
            className="h-10 rounded-xl px-4 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/10"
            onClick={() => {
              dispatch(toggle());
            }}
          >
            {isPanelOpen ? <PanelRightOpen /> : <PanelRightClose />}
          </button>
          {navGroups.map((group) => (
            <div key={group.title} className="mb-3 last:mb-0">
              <p className="px-3 py-1 text-[15px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => {
                        navigate(`/profile/manage?activeTab=${item.key}`);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Icon size={24} className="text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-2 border-t border-white/10 pt-2">
            <button
              type="button"
              onClick={() => {}}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-white/5 hover:text-red-300"
            >
              <div className="flex items-center gap-3">
                <LogOut size={16} />
                <div> {t("navbar.logout") || "Logout"}</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SidePanel;
