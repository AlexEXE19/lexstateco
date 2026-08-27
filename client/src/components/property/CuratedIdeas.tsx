import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { useTranslation } from "../../utils/i18n";

interface CuratedPick {
  tag: string;
  location: string;
}

interface CuratedIdeasProps {
  onExplore: (location: string) => void;
}

const CuratedIdeas: React.FC<CuratedIdeasProps> = ({ onExplore }) => {
  const { t } = useTranslation();
  const [picks, setPicks] = useState<CuratedPick[]>([]);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await axios.get<CuratedPick[]>(`${baseURL}/curated/today`);
        setPicks(res.data);
      } catch (err) {
        console.error("Error fetching curated picks:", err);
      }
    };

    fetchPicks();
  }, []);

  if (picks.length === 0) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-secondary-500 to-cyan-400 p-[1px]">
      <div className="rounded-[15px] bg-background-surface/70 p-5 ring-1 ring-white/10 shadow-md">
        <div className="flex items-center justify-between text-sm font-semibold text-white">
          <span>{t("home.hero.curated")}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100 ring-1 ring-white/10">
            {t("home.hero.curatedCount")}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {picks.map((pick) => (
            <div
              key={pick.tag}
              className="flex items-start justify-between gap-3 rounded-xl bg-background-surface/60 px-4 py-3 ring-1 ring-white/10"
            >
              <div>
                <p className="font-semibold text-white">{pick.tag}</p>
                <p className="text-sm text-slate-200">{pick.location}</p>
              </div>
              <button
                className="shrink-0 text-xs font-semibold text-secondary-200"
                onClick={() => onExplore(pick.location)}
              >
                {t("home.hero.curatedExplore")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuratedIdeas;
