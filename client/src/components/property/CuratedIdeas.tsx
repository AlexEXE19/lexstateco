import { useTranslation } from "../../utils/i18n";

const CuratedIdeas: React.FC = () => {
  const { t } = useTranslation();

  const curatedIdeas = [
    {
      title: t("home.curated.idea1.title"),
      meta: t("home.curated.idea1.meta"),
    },
    {
      title: t("home.curated.idea2.title"),
      meta: t("home.curated.idea2.meta"),
    },
    {
      title: t("home.curated.idea3.title"),
      meta: t("home.curated.idea3.meta"),
    },
  ];

  const scrollToResults = () => {
    document
      .getElementById("properties-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          {curatedIdeas.map((idea) => (
            <div
              key={idea.title}
              className="flex items-start justify-between gap-3 rounded-xl bg-background-surface/60 px-4 py-3 ring-1 ring-white/10"
            >
              <div>
                <p className="font-semibold text-white">{idea.title}</p>
                <p className="text-sm text-slate-200">{idea.meta}</p>
              </div>
              <button
                className="shrink-0 text-xs font-semibold text-secondary-200"
                onClick={scrollToResults}
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
