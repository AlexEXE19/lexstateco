import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { logOutUser } from "../state/user/userSlice";
import { clearAuthToken } from "../utils/auth";
import { setLanguage } from "../state/lang/langSlice";
import { useTranslation } from "../utils/i18n";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const lang = useSelector((state: RootState) => state.lang);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

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
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
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
