import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, HelpCircle, Compass } from "lucide-react";

import { useTranslation } from "../../utils/i18n";

interface NavAuthLinksProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const menuItem =
  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ink-muted transition-colors hover:bg-background-elevated hover:text-ink";

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

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn-quiet"
        >
          {t("navbar.login")}
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="btn-primary px-4 py-2"
        >
          {t("navbar.register")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("navbar.profile")}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-background-elevated hover:text-ink"
      >
        <User size={18} />
      </button>

      {isDropdownOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-lg border border-line bg-background-surface py-1.5 shadow-panel">
            <button
              type="button"
              onClick={() => goTo("/profile/me")}
              className={menuItem}
            >
              <User size={16} className="text-ink-subtle" />
              {t("navbar.profile")}
            </button>
            <button
              type="button"
              onClick={() => goTo("/settings")}
              className={menuItem}
            >
              <Settings size={16} className="text-ink-subtle" />
              {t("navbar.settings")}
            </button>
            <button
              type="button"
              onClick={() => goTo("/get-started")}
              className={menuItem}
            >
              <Compass size={16} className="text-ink-subtle" />
              {t("navbar.whyUs")}
            </button>
            <button
              type="button"
              onClick={() => goTo("/get-started")}
              className={menuItem}
            >
              <HelpCircle size={16} className="text-ink-subtle" />
              {t("navbar.help")}
            </button>

            <div className="my-1.5 border-t border-line" />

            <button
              type="button"
              onClick={() => {
                close();
                onLogout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-secondary-600 transition-colors hover:bg-secondary-50"
            >
              <LogOut size={16} />
              {t("navbar.logout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NavAuthLinks;
