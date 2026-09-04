import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  ClipboardList,
  Home,
  Building2,
  Users,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";

import { RootState } from "../../state/store";
import { toggle } from "../../state/sidePanel/sidePanelSlice";
import { logOutUser } from "../../state/user/userSlice";
import { useTranslation } from "../../utils/i18n";

const MANAGE_PATH = "/profile/manage";

const SidePanel: React.FC = () => {
  const isPanelOpen = useSelector((state: RootState) => state.sidePanel.isOpen);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const activeTab =
    location.pathname === MANAGE_PATH
      ? new URLSearchParams(location.search).get("activeTab")
      : null;

  const navGroups = useMemo(
    () => [
      {
        title: t("account.group.buyer"),
        items: [
          { key: "saved", label: t("account.tabs.saved"), icon: Heart },
          {
            key: "requests",
            label: t("account.tabs.requests"),
            icon: ClipboardList,
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
          },
          { key: "list", label: t("account.tabs.list"), icon: Home },
          {
            key: "audience",
            label: t("account.tabs.audience"),
            icon: Users,
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
          },
        ],
      },
    ],
    [t],
  );

  const close = () => dispatch(toggle());

  const handleLogout = () => {
    dispatch(logOutUser());
    close();
    navigate("/");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-ink/25 transition-opacity duration-200 ${
          isPanelOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-[19rem] transform flex-col border-l border-line bg-background-surface transition-transform duration-300 ease-out ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isPanelOpen}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="eyebrow">{t("navbar.myAccount")}</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-subtle transition-colors hover:bg-background-elevated hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-7 last:mb-0">
              <p className="px-3 pb-2 text-[11px] uppercase tracking-label text-ink-subtle">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.key === activeTab;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => {
                        navigate(`${MANAGE_PATH}?activeTab=${item.key}`);
                      }}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-primary-50 font-medium text-primary-800"
                          : "text-ink-muted hover:bg-background-elevated hover:text-ink"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={
                          isActive ? "text-primary-700" : "text-ink-subtle"
                        }
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-secondary-600 transition-colors hover:bg-secondary-50"
          >
            <LogOut size={16} />
            {t("navbar.logout")}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidePanel;
