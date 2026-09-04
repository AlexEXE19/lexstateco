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
    <nav className="sticky z-10 top-0  w-full bg-gradient-to-r from-background via-background-surface to-primary-900/90 text-white shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 mx-5 px-5 py-4">
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

        <NavLink
          to="/properties"
          className={({ isActive }) =>
            `text-sm font-medium transition ${
              isActive ? "text-white" : "text-slate-300 hover:text-white"
            }`
          }
        >
          {t("nav.properties") || "Properties"}
        </NavLink>

        <div className="flex items-center gap-3">
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

          {/* Side panel toggle */}
          <button
            className="h-10 rounded-xl px-4 text-sm font-semibold text-white  transition hover:bg-white/10"
            onClick={() => {
              dispatch(toggle());
            }}
          >
            {isPanelOpen ? <PanelRightOpen /> : <PanelRightClose />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
