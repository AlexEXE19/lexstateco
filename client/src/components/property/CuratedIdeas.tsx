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
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
      <span className="eyebrow mr-1">{t("home.hero.curated")}</span>
      {picks.map((pick, index) => (
        <span key={pick.tag} className="flex items-center gap-2">
          {index > 0 && <span className="text-line-strong">·</span>}
          <button
            type="button"
            onClick={() => onExplore(pick.location)}
            className="text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            {pick.tag}
            <span className="text-ink-subtle"> — {pick.location}</span>
          </button>
        </span>
      ))}
    </div>
  );
};

export default CuratedIdeas;
