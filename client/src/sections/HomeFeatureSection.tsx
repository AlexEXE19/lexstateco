import { Link } from "react-router-dom";
import UserTypeSelector from "./UserTypeSelector";
import { useTranslation } from "../utils/i18n";
import { FeatureHighlight } from "./HomeHero";

interface HomeFeatureSectionProps {
  featureHighlights: FeatureHighlight[];
}

const HomeFeatureSection: React.FC<HomeFeatureSectionProps> = ({
  featureHighlights,
}) => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-6xl space-y-10 px-6 py-16"></div>

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              {t("home.section.label")}
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-white">
              {t("home.section.title")}
            </h2>

            <p className="mt-2 text-slate-200">{t("home.section.desc")}</p>
          </div>

          <div className="flex shrink-0">
            <Link
              to="/properties"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-400/30 transition hover:-translate-y-[1px] hover:shadow-cyan-300/40"
            >
              {t("home.section.cta")}
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.title}-card`}
                className="group rounded-2xl bg-slate-900/70 p-5 text-white shadow-md ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-slate-900/60 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-100 ring-1 ring-sky-200/30 group-hover:bg-sky-500/25">
                  <Icon size={20} />
                </div>
                <p className="mt-4 text-lg font-semibold text-white">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-slate-200">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-slate-900/70 shadow-2xl ring-1 ring-white/10">
          <UserTypeSelector />
        </div>
      </div>
    </section>
  );
};

export default HomeFeatureSection;
