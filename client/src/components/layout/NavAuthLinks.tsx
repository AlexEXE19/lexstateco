import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../utils/i18n";
import { useState } from "react";
import {
  LogOut,
  LogIn,
  UserCircle,
  User,
  Settings,
  HelpCircle,
  Compass,
} from "lucide-react";

interface NavAuthLinksProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const NavAuthLinks: React.FC<NavAuthLinksProps> = ({
  isLoggedIn,
  onLogout,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const close = () => setIsDropdownOpen(false);

  const goTo = (path: string) => {
    close();
    navigate(path);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <UserCircle size={28} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 p-3 shadow-xl ring-1 ring-white/10">
          {isLoggedIn ? (
            <div>
              <button
                type="button"
                onClick={() => goTo("/account/profile")}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <User size={16} />
                  <div>{t("navbar.profile") || "Profile"}</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  close();
                  onLogout();
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-white/5 hover:text-red-300"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={16} />
                  <div>{t("navbar.logout") || "Logout"}</div>
                </div>
              </button>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => goTo("/login")}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <LogIn size={16} />
                  <div>{t("navbar.login") || "Log in"}</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => goTo("/why-us")}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <Compass size={16} />
                  <div>{t("navbar.whyUs") || "Why us"}</div>
                </div>
              </button>
            </div>
          )}

          <div className="mt-2 border-t border-white/10 pt-2">
            <button
              type="button"
              onClick={() => goTo("/settings")}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Settings size={16} />
                <div>{t("navbar.settings") || "Settings"}</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => goTo("/help")}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={16} />
                <div>{t("navbar.help") || "Help"}</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavAuthLinks;
