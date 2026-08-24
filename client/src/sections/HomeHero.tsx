import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, type LucideIcon } from "lucide-react";
import { useLocationSuggestions } from "../hooks/property/useLocationSuggestions";
import { useTranslation } from "../utils/i18n";

export interface FeatureHighlight {
  title: string;
  desc: string;
  icon: LucideIcon;
}

const HomeHero: React.FC = () => {
  const [searchedLocation, setSearchedLocation] = useState<string>();
  const [query, setQuery] = useState<string>();
  const [suggestions, setSuggestions] = useState<any[]>();

  useLocationSuggestions(query, setSuggestions);

  const { t } = useTranslation();

  const stats = [
    { label: t("home.hero.stat.active"), value: "1.2k+" },
    { label: t("home.hero.stat.response"), value: "< 24h" },
    { label: t("home.hero.stat.rating"), value: "4.9 / 5" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/homepage.jpg')] bg-cover bg-[center_top_15%] opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-surface/85 to-secondary-900/70" />
        <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-secondary-400/30 blur-[120px]" />
        <div className="absolute bottom-10 right-4 h-64 w-64 rounded-full bg-cyan-300/25 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-3xl space-y-6 px-6 py-24 md:py-32">
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
              <div className="min-w-0 flex-1">
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
    </section>
  );
};

export default HomeHero;
