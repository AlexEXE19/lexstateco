import { Language } from "../../state/lang/langSlice";
import { useTranslation } from "../../utils/i18n";

interface LanguageMenuProps {
  lang: Language;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: "en" | "ro") => void;
}

const LanguageMenu: React.FC<LanguageMenuProps> = ({
  lang,
  isOpen,
  onToggle,
  onChange,
}) => {
  const { t } = useTranslation();
  const languageLabel = lang === "ro" ? "Română" : "English";
  const languageFlag = lang === "ro" ? "🇷🇴" : "🇬🇧";

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
      >
        <span className="text-base">{languageFlag}</span>
        <span>{languageLabel}</span>
        <span className="text-[10px] text-slate-200">▼</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl bg-slate-900/90 text-sm text-white shadow-lg ring-1 ring-white/15">
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/10"
            onClick={() => onChange("en")}
          >
            <span className="text-base">🇬🇧</span>
            <span>{t("navbar.english")}</span>
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/10"
            onClick={() => onChange("ro")}
          >
            <span className="text-base">🇷🇴</span>
            <span>{t("navbar.romanian")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageMenu;
