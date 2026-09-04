import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { RootState } from "../../state/store";
import { logOutUser } from "../../state/user/userSlice";
import { setLanguage } from "../../state/lang/langSlice";
import { toggle } from "../../state/sidePanel/sidePanelSlice";
import { useTranslation } from "../../utils/i18n";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationsMenu from "./NotificationsMenu";
import NavAuthLinks from "./NavAuthLinks";

type OpenMenu = "notifications" | "language" | null;

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.user.id);
  const isPanelOpen = useSelector((state: RootState) => state.sidePanel.isOpen);

  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const { notifications, clearNotifications, loadNotifications } =
    useNotifications(userId);

  const handleClick = () => {
    dispatch(logOutUser());
    navigate("/");
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

  const toggleNotifications = () => {
    const nextOpen = openMenu === "notifications" ? null : "notifications";
    setOpenMenu(nextOpen);
    if (nextOpen) {
      loadNotifications();
    }
  };

  // TO DO UPDATE TO NEW SCHEMA
  const handleNotificationClick = async () => {};

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-6 lg:px-10">
        <Link to="/" className="flex items-baseline gap-2.5">
          <span className="font-display text-xl leading-none tracking-tight text-ink">
            LexEstate
          </span>
          <span className="hidden text-[11px] uppercase tracking-label text-ink-subtle sm:inline">
            {t("navbar.brandTag")}
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `border-b-2 pb-0.5 text-sm transition-colors ${
                isActive
                  ? "border-primary-700 text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`
            }
          >
            {t("nav.properties")}
          </NavLink>
          <NavLink
            to="/profile/manage?activeTab=list"
            className="border-b-2 border-transparent pb-0.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            {t("account.tabs.list")}
          </NavLink>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {userId !== "-1" && (
            <NotificationsMenu
              notifications={notifications}
              isOpen={openMenu === "notifications"}
              onToggle={toggleNotifications}
              onClear={clearNotifications}
              onNotificationClick={handleNotificationClick}
            />
          )}

          <NavAuthLinks isLoggedIn={userId !== "-1"} onLogout={handleClick} />

          {userId !== "-1" && (
            <button
              type="button"
              aria-label={t("navbar.myAccount")}
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-background-elevated hover:text-ink"
              onClick={() => {
                dispatch(toggle());
              }}
            >
              {isPanelOpen ? (
                <PanelRightClose size={18} />
              ) : (
                <PanelRightOpen size={18} />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
