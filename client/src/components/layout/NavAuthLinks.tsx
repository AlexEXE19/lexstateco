import { Link } from "react-router-dom";
import { useTranslation } from "../../utils/i18n";

interface NavAuthLinksProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const NavAuthLinks: React.FC<NavAuthLinksProps> = ({
  isLoggedIn,
  onLogout,
}) => {
  const { t } = useTranslation();

  if (isLoggedIn) {
    return (
      <>
        <Link
          to="/account"
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10"
        >
          {t("navbar.myAccount")}
        </Link>
        <Link to="/">
          <button
            onClick={onLogout}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/20"
          >
            {t("navbar.logout")}
          </button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        to="/login"
        className="rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10"
      >
        {t("navbar.login")}
      </Link>
      <Link
        to="/register"
        className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400"
      >
        {t("navbar.register")}
      </Link>
    </>
  );
};

export default NavAuthLinks;
