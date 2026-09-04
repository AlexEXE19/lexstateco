import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Search, type LucideIcon } from "lucide-react";

import baseURL from "../config/baseUrl";
import { RootState } from "../state/store";
import { useLocationSuggestions } from "../hooks/property/useLocationSuggestions";
import { buildQuery } from "../utils/buildQuery";
import { useTranslation } from "../utils/i18n";

export interface FeatureHighlight {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface Stats {
  userCount: number;
  propertyCount: number;
  averageRating: number;
}

const HomeHero: React.FC = () => {
  const clientMeta = useSelector((state: RootState) => state.client);
  const navigate = useNavigate();

  const [searchedLocation, setSearchedLocation] = useState<string>("");
  const [clientCountryCode, setClientCountryCode] = useState<string>("ro");
  const [suggestions, setSuggestions] = useState<any[]>();

  // Suggestions are scoped to the visitor's own country so a search for
  // "Springfield" surfaces the one they probably mean.
  const stringQuery = buildQuery({
    q: searchedLocation,
    countrycodes: clientCountryCode,
    featuretype: "settlement",
  });
  const toggle = searchedLocation.length > 0;
  useLocationSuggestions(stringQuery, setSuggestions, toggle);

  const { t } = useTranslation();

  const [statsValues, setStatsValues] = useState<Stats>({
    userCount: 10000,
    propertyCount: 1000,
    averageRating: 5,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 !== 0 ? 1 : 0) + "k";
    }
    return num.toString();
  };

  const stats = [
    { label: "Members", value: formatNumber(statsValues.userCount) },
    { label: "Listings", value: formatNumber(statsValues.propertyCount) },
    { label: "Rating", value: Number(statsValues.averageRating).toFixed(1) },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<Stats>(`${baseURL}/stats/summary`);
        if (res.data) setStatsValues(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (clientMeta?.countryName) {
      setClientCountryCode(clientMeta.countryCode.toLocaleLowerCase());
    }
  }, [clientMeta?.countryName]);

  const submitSearch = (location?: string) => {
    const query = (location ?? searchedLocation).trim();
    navigate(query ? `/properties?location=${encodeURIComponent(query)}` : "/properties");
  };

  return (
    <section className="border-b border-line">
      <div className="grid items-stretch lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 lg:items-end lg:py-24 lg:pl-10 lg:pr-16">
          <div className="w-full lg:max-w-[620px]">
          <p className="eyebrow">{t("home.hero.tag")}</p>

          <h1 className="mt-5 max-w-xl font-display text-display-sm text-ink sm:text-display-md">
            {t("home.hero.title")}
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
            {t("home.hero.subtitle")}
          </p>

          <div className="relative mt-9 max-w-lg">
            <label className="field-label" htmlFor="hero-search">
              {t("home.hero.inputLabel")}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"
                />
                <input
                  id="hero-search"
                  type="text"
                  value={searchedLocation}
                  onChange={(e) => setSearchedLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch();
                  }}
                  autoComplete="off"
                  placeholder={t("home.hero.inputPlaceholder")}
                  className="field pl-10"
                />

                {suggestions && suggestions.length > 0 && (
                  <ul className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-64 overflow-y-auto rounded-md border border-line bg-background-surface shadow-panel">
                    {suggestions.map((s, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchedLocation(s.city);
                            setSuggestions([]);
                            submitSearch(s.city);
                          }}
                          className="block w-full border-b border-line px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-background-elevated"
                        >
                          <span className="block text-sm text-ink">{s.city}</span>
                          <span className="mt-0.5 block truncate text-xs text-ink-subtle">
                            {[s.city, s.county, s.country].filter(Boolean).join(", ")}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={() => submitSearch()}
                className="btn-primary shrink-0"
              >
                {t("home.hero.browse")}
              </button>
            </div>
          </div>

            <dl className="mt-12 flex max-w-lg divide-x divide-line border-y border-line">
              {stats.map((stat) => (
                <div key={stat.label} className="flex-1 py-5 pl-5 first:pl-0">
                  <dt className="text-[11px] uppercase tracking-label text-ink-subtle">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5 font-display text-2xl leading-none text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative min-h-[18rem] lg:min-h-[34rem]">
          <img
            src="/homepage.jpg"
            alt="An agent showing a listed home to buyers"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
