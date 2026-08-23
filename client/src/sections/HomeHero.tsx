import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Search, Sparkles, type LucideIcon } from "lucide-react";
import { useLocationSuggestions } from "../hooks/property/useLocationSuggestions";
import { getCurrentUser } from "../utils/auth";
import { setTab } from "../state/tab/tabSlice";
import { useTranslation } from "../utils/i18n";

export interface FeatureHighlight {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface HomeHeroProps {
  featureHighlights: FeatureHighlight[];
}

const HomeHero: React.FC<HomeHeroProps> = ({ featureHighlights }) => {
  const [searchedLocation, setSearchedLocation] = useState<string>();
  const [query, setQuery] = useState<string>();
  const [suggestions, setSuggestions] = useState<any[]>();

  useLocationSuggestions(query, setSuggestions);

  const navigate = useNavigate();

  const [currentUser] = useState(getCurrentUser());
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const stats = [
    { label: t("home.hero.stat.active"), value: "1.2k+" },
    { label: t("home.hero.stat.response"), value: "< 24h" },
    { label: t("home.hero.stat.rating"), value: "4.9 / 5" },
  ];

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

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/homepage.jpg')] bg-cover bg-[center_top_15%] opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-surface/85 to-secondary-900/70" />
        <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-secondary-400/30 blur-[120px]" />
        <div className="absolute bottom-10 right-4 h-64 w-64 rounded-full bg-cyan-300/25 blur-[110px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <Sparkles size={16} />
            <span>{t("home.hero.tag")}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              {t("home.hero.title")}
            </h1>
            <p className="text-lg text-slate-200 md:text-xl">
              {t("home.hero.subtitle")}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <label className="text-sm uppercase tracking-wide text-slate-200">
              {t("home.hero.inputLabel")}
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                <Search size={18} className="text-primary-200" />
                <div>
                  <input
                    type="text"
                    value={searchedLocation ?? ""}
                    onChange={(e) => {
                      setSearchedLocation(e.target.value);
                      setQuery(e.target.value);
                    }}
                    list="city-suggestions"
                    placeholder={t("home.hero.inputPlaceholder")}
                    className="w-full bg-transparent text-base text-white placeholder:text-slate-300 focus:outline-none"
                  />
                  <datalist id="city-suggestions">
                    {suggestions?.map((s, index) => (
                      <option key={index} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>

              <Link
                to="/properties"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-secondary-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-secondary-400/30 transition hover:-translate-y-[1px] hover:shadow-cyan-400/40"
              >
                {t("home.hero.browse")}
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/properties"
              className="rounded-xl bg-secondary-500/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-secondary-300/30 transition hover:bg-secondary-500/30 hover:ring-secondary-200/50"
            >
              {t("home.hero.viewListings")}
            </Link>
            <Link
              to={currentUser ? "/account" : "/register"}
              onClick={() => {
                dispatch(setTab("list"));
              }}
              className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              {t("home.hero.listProperty")}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10"
              >
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-sm text-slate-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-background-surface/70 p-6 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-secondary-500/15 px-3 py-1 text-xs font-semibold text-secondary-100 ring-1 ring-secondary-200/30">
              {t("home.hero.freshDrops")}
            </div>
            <span className="text-xs text-slate-200">
              {t("home.hero.updated")}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {featureHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/20 text-primary-200">
                    <Icon size={20} />
                  </span>

                  <div className="space-y-1">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-slate-200">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-secondary-500 to-cyan-400 p-[1px]">
            <div className="flex flex-col gap-4 rounded-[15px] bg-background-surface/70 p-5 text-white ring-1 ring-white/10 shadow-md">
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>{t("home.hero.curated")}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100 ring-1 ring-white/10">
                  {t("home.hero.curatedCount")}
                </span>
              </div>

              <div className="space-y-3">
                {curatedIdeas.map((idea) => (
                  <div
                    key={idea.title}
                    className="flex items-start justify-between rounded-xl bg-background-surface/60 px-4 py-3 ring-1 ring-white/10"
                  >
                    <div>
                      <p className="font-semibold text-white">{idea.title}</p>
                      <p className="text-sm text-slate-200">{idea.meta}</p>
                    </div>
                    <button
                      className="text-xs font-semibold text-secondary-200"
                      onClick={() => {
                        navigate("/properties");
                      }}
                    >
                      {t("home.hero.curatedExplore")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
