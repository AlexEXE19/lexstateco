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

  // One consistent hierarchy for every nav button: ghost (ring only, no
  // fill) for neutral/secondary actions, solid primary for the one main
  // CTA. All share the same height so they align on one baseline
  // regardless of label length or whether they're a <Link> or <button>.
  const ghost =
    "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10";
  const primary =
    "inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-4 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400";

  if (isLoggedIn) {
    return (
      <>
        <Link to="/account" className={ghost}>
          {t("navbar.myAccount")}
        </Link>
        <button onClick={onLogout} className={ghost}>
          {t("navbar.logout")}
        </button>
      </>
    );
  }

  return (
    <>
      <Link to="/login" className={ghost}>
        {t("navbar.login")}
      </Link>
      <Link to="/register" className={primary}>
        {t("navbar.register")}
      </Link>
    </>
  );
};

export default NavAuthLinks;
