import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { logOutUser } from "../state/user/userSlice";
import { setLanguage } from "../state/lang/langSlice";
import { useTranslation } from "../utils/i18n";
import { useNotifications, formatTimeAgo } from "../hooks/useNotifications";
import { Notification } from "../types/types";
import { setTab } from "../state/tab/tabSlice";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.id);
  const lang = useSelector((state: RootState) => state.lang);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const {
    notifications,
    clearNotifications,
    loadNotifications,
    deleteNotification,
  } = useNotifications(userId);

  const notificationCount = notifications.length;

  const handleClick = () => {
    dispatch(logOutUser());
  };

  useEffect(() => {
    // If no stored preference, pick based on browser language
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("lex_lang");
    if (!stored) {
      const navLang = navigator.language?.toLowerCase() || "";
      if (navLang.startsWith("ro")) {
        dispatch(setLanguage("ro"));
      }
    }
  }, [dispatch]);

  const languageLabel = useMemo(
    () => (lang === "ro" ? "Română" : "English"),
    [lang],
  );

  const languageFlag = lang === "ro" ? "🇷🇴" : "🇬🇧";

  const changeLanguage = (value: "en" | "ro") => {
    dispatch(setLanguage(value));
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lex_lang", value);
    }
    setOpen(false);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (nextOpen) {
      loadNotifications();
    }
    setOpen(false);
  };

  const handleNotificationClick = async (notification: Notification) => {
    const targetTab =
      notification.type === "incoming_request" ? "audience" : "requests";

    navigate("/account");
    dispatch(setTab(targetTab));
    setNotificationsOpen(false);

    await deleteNotification(notification.id);
  };

  return (
    <nav className="sticky top-0 z-20 w-full bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900/90 text-white shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/home" className="flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-black tracking-tight ring-1 ring-white/15">
            LE
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold">LexEstateCo</span>
            <span className="text-xs text-slate-200">
              {t("navbar.brandTag")}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {userId !== "-1" && (
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={toggleNotifications}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M12 2.75a5.25 5.25 0 00-5.25 5.25v2.494l-.894 2.682A1 1 0 006.806 14h10.388a1 1 0 00.95-1.324l-.894-2.682V8a5.25 5.25 0 00-5.25-5.25z" />
                  <path d="M14.25 16.5a2.25 2.25 0 11-4.5 0h4.5z" />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold leading-none shadow-lg shadow-rose-500/30">
                    {notificationCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl bg-slate-900/95 text-sm text-white shadow-2xl shadow-black/30 ring-1 ring-white/15 backdrop-blur">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="text-xs uppercase tracking-[0.08em] text-slate-200">
                      Notifications
                    </span>
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs font-semibold text-slate-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={notificationCount === 0}
                    >
                      Clear
                    </button>
                  </div>

                  {notificationCount === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-300">
                      You're all caught up — no notifications.
                    </div>
                  ) : (
                    <ul className="max-h-72 divide-y divide-white/5 overflow-auto">
                      {notifications.map((notification: Notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                        >
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">
                              {notification.title}
                            </span>
                            <p className="text-xs text-slate-200">
                              {notification.description}
                            </p>
                            <span className="text-[11px] uppercase tracking-[0.08em] text-slate-400">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => {
                setOpen((v) => !v);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <span className="text-base">{languageFlag}</span>
              <span>{languageLabel}</span>
              <span className="text-[10px] text-slate-200">▼</span>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl bg-slate-900/90 text-sm text-white shadow-lg ring-1 ring-white/15">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/10"
                  onClick={() => changeLanguage("en")}
                >
                  <span className="text-base">🇬🇧</span>
                  <span>{t("navbar.english")}</span>
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/10"
                  onClick={() => changeLanguage("ro")}
                >
                  <span className="text-base">🇷🇴</span>
                  <span>{t("navbar.romanian")}</span>
                </button>
              </div>
            )}
          </div>

          {userId !== "-1" ? (
            <>
              <Link
                to="/account"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10"
              >
                {t("navbar.myAccount")}
              </Link>
              <Link to="/home">
                <button
                  onClick={handleClick}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/20"
                >
                  {t("navbar.logout")}
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10"
              >
                {t("navbar.login")}
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
              >
                {t("navbar.register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
