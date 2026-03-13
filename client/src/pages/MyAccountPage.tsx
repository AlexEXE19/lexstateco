import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  ClipboardList,
  Home,
  Building2,
  Users,
  MessageSquare,
} from "lucide-react";
import { RootState } from "../state/store";
import SavedPropertiesTab from "../components/SavedPropertiesTab";
import UserPropertiesTab from "../components/UserPropertiesTab";
import PropertyListingTab from "../components/PropertyListingTab";
import MyAudienceTab from "../components/MyAudienceTab";
import MyRequestsTab from "../components/MyRequestsTab";
import { getCurrentUser } from "../utils/auth";
import { User } from "../types/types";
import { setTab } from "../state/tab/tabSlice";
import { useTranslation } from "../utils/i18n";

const MyAccountPage: React.FC = () => {
  const activeTab = useSelector((state: RootState) => state.tab).type;
  const dispatch = useDispatch();

  const firstName = useSelector((state: RootState) => state.user.firstName);
  const userId = useSelector((state: RootState) => state.user.id);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [currentUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    if (currentUser === null) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

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
          { key: "audience", label: t("account.tabs.audience"), icon: Users },
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/80 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
            My account
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="max-w-2xl text-slate-200">
            Manage your saved homes, your listings, and your audience in one
            calm workspace.
          </p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {group.title}
                </p>
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => dispatch(setTab(item.key))}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-white/5 text-slate-100 ring-1 ring-white/10 hover:-translate-y-[1px] hover:ring-blue-300/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              isActive
                                ? "bg-white/15 ring-1 ring-white/20"
                                : "bg-white/5 ring-1 ring-white/10"
                            }`}
                          >
                            <Icon size={18} />
                          </span>
                          <span className="text-sm font-semibold">
                            {item.label}
                          </span>
                        </div>
                        {item.key === "messages" && (
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                            Soon
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            {activeTab === "saved" && <SavedPropertiesTab />}
            {activeTab === "myProperties" && <UserPropertiesTab />}
            {activeTab === "list" && <PropertyListingTab />}
            {activeTab === "requests" && <MyRequestsTab />}
            {activeTab === "audience" && <MyAudienceTab />}
            {activeTab === "messages" && (
              <div className="space-y-3 text-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {t("account.group.chat")}
                </p>
                <h2 className="text-2xl font-semibold">{t("account.messages.title")}</h2>
                <p className="text-sm text-slate-300">{t("account.messages.subtitle")}</p>
                <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-sm text-slate-200">
                  {t("account.messages.placeholder")}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountPage;
