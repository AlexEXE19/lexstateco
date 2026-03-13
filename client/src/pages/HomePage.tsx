import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";
import UserTypeSelector from "../sections/UserTypeSelector";
import { useLocationSuggestions } from "../hooks/useLocationSuggestions";
import { getCurrentUser } from "../utils/auth";
import { useDispatch } from "react-redux";
import { setTab } from "../state/tab/tabSlice";
import { useTranslation } from "../utils/i18n";

const HomePage: React.FC = () => {
  const [searchedLocation, setSearchedLocation] = useState<string>();
  const [query, setQuery] = useState<string>();
  const [suggestions, setSuggestions] = useState<any[]>();

  useLocationSuggestions(query, setSuggestions);

  const [currentUser] = useState(getCurrentUser());
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const featureHighlights = [
    {
      title: t("home.feature1.title"),
      desc: t("home.feature1.desc"),
      icon: ShieldCheck,
    },
    {
      title: t("home.feature2.title"),
      desc: t("home.feature2.desc"),
      icon: MapPin,
    },
    {
      title: t("home.feature3.title"),
      desc: t("home.feature3.desc"),
      icon: Clock3,
    },
  ];

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
    <div className="bg-slate-950 text-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/homepage.jpg')] bg-cover bg-[center_top_15%] opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/85 to-sky-900/70" />
          <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-sky-400/30 blur-[120px]" />
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
                  <Search size={18} className="text-blue-200" />
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
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-400/30 transition hover:-translate-y-[1px] hover:shadow-cyan-400/40"
                >
                  {t("home.hero.browse")}
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/properties"
                className="rounded-xl bg-sky-500/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-sky-300/30 transition hover:bg-sky-500/30 hover:ring-sky-200/50"
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

          <div className="rounded-3xl bg-slate-900/70 p-6 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-100 ring-1 ring-sky-200/30">
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
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
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

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-[1px]">
              <div className="flex flex-col gap-4 rounded-[15px] bg-slate-900/70 p-5 text-white ring-1 ring-white/10 shadow-md">
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
                      className="flex items-start justify-between rounded-xl bg-slate-900/60 px-4 py-3 ring-1 ring-white/10"
                    >
                      <div>
                        <p className="font-semibold text-white">{idea.title}</p>
                        <p className="text-sm text-slate-200">{idea.meta}</p>
                      </div>
                      <span className="text-xs font-semibold text-sky-200">
                        {t("home.hero.curatedExplore")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default HomePage;
