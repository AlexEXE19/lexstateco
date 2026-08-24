import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { logOutUser } from "../../state/user/userSlice";
import { setLanguage } from "../../state/lang/langSlice";
import { useTranslation } from "../../utils/i18n";
import { useNotifications } from "../../hooks/useNotifications";
import { Notification } from "../../types/types";
import { setTab, setConversationId } from "../../state/tab/tabSlice";
import NotificationsMenu from "./NotificationsMenu";
import LanguageMenu from "./LanguageMenu";
import NavAuthLinks from "./NavAuthLinks";

type OpenMenu = "notifications" | "language" | null;

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.id);
  const lang = useSelector((state: RootState) => state.lang);
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const {
    notifications,
    clearNotifications,
    loadNotifications,
    deleteNotification,
  } = useNotifications(userId);

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

  const changeLanguage = (value: "en" | "ro") => {
    dispatch(setLanguage(value));
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lex_lang", value);
    }
    setOpenMenu(null);
  };

  const toggleNotifications = () => {
    const nextOpen = openMenu === "notifications" ? null : "notifications";
    setOpenMenu(nextOpen);
    if (nextOpen) {
      loadNotifications();
    }
  };

  const toggleLanguage = () => {
    setOpenMenu((current) => (current === "language" ? null : "language"));
  };

  const handleNotificationClick = async (notification: Notification) => {
    let targetTab = "requests";
    if (notification.type === "incoming_request") targetTab = "audience";
    if (notification.type === "message") targetTab = "messages";

    navigate("/account");
    dispatch(setTab(targetTab));
    if (notification.type === "message") {
      dispatch(setConversationId(null));
    }
    setOpenMenu(null);

    await deleteNotification(notification.id);
  };

  return (
    <nav className="sticky top-0 z-20 w-full bg-gradient-to-r from-background via-background-surface to-primary-900/90 text-white shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-3 text-white">
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
          <Link
            to="/get-started"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10"
          >
            {t("navbar.getStarted")}
          </Link>

          {userId !== "-1" && (
            <NotificationsMenu
              notifications={notifications}
              isOpen={openMenu === "notifications"}
              onToggle={toggleNotifications}
              onClear={clearNotifications}
              onNotificationClick={handleNotificationClick}
            />
          )}

          <LanguageMenu
            lang={lang}
            isOpen={openMenu === "language"}
            onToggle={toggleLanguage}
            onChange={changeLanguage}
          />

          <NavAuthLinks isLoggedIn={userId !== "-1"} onLogout={handleClick} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
