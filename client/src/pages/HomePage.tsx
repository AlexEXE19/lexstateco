import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";
import UserTypeSelector from "../sections/UserTypeSelector";

const HomePage: React.FC = () => {
  const [searchedLocation, setSearchedLocation] = useState<string>();

  const featureHighlights = [
    {
      title: "Verified listings only",
      desc: "Every property is vetted and photo-checked by our team.",
      icon: ShieldCheck,
    },
    {
      title: "Local guidance",
      desc: "Talk to area specialists who know the streets and schools.",
      icon: MapPin,
    },
    {
      title: "Tours on your time",
      desc: "Book in-person or virtual showings in just a few taps.",
      icon: Clock3,
    },
  ];

  const stats = [
    { label: "Active listings", value: "1.2k+" },
    { label: "Avg. response", value: "< 24h" },
    { label: "Client rating", value: "4.9 / 5" },
  ];

  const curatedIdeas = [
    { title: "Waterfront escapes", meta: "Seattle & Portland" },
    { title: "Family-ready homes", meta: "Austin suburbs" },
    { title: "Modern downtown lofts", meta: "Chicago & Denver" },
  ];

  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/homepage.jpg')] bg-cover bg-[center_top_15%] opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-blue-900/80" />
          <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-blue-500/30 blur-[120px]" />
          <div className="absolute bottom-10 right-4 h-64 w-64 rounded-full bg-cyan-400/20 blur-[110px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <Sparkles size={16} />
              <span>Modern spaces, curated for you</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                Find a home you love, or list yours with confidence.
              </h1>
              <p className="text-lg text-slate-200 md:text-xl">
                Compare neighborhoods, tour faster, and get personalized help
                from real people—not generic feeds.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur">
              <label className="text-sm uppercase tracking-wide text-slate-200">
                Start with a location
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                  <Search size={18} className="text-blue-200" />
                  <input
                    type="text"
                    value={searchedLocation ?? ""}
                    onChange={(e) => setSearchedLocation(e.target.value)}
                    placeholder="City, neighborhood, or ZIP"
                    className="w-full bg-transparent text-base text-white placeholder:text-slate-300 focus:outline-none"
                  />
                </div>

                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:shadow-blue-500/30"
                >
                  Browse properties
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/properties"
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"
              >
                View listings
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                List your property
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

          <div className="rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200/60">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Fresh drops
              </div>
              <span className="text-xs text-slate-500">Updated daily</span>
            </div>

            <div className="mt-6 space-y-4">
              {featureHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Icon size={20} />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-[1px]">
              <div className="flex flex-col gap-4 rounded-[15px] bg-white/95 p-5 shadow-md">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>Curated for today</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    15 picks
                  </span>
                </div>

                <div className="space-y-3">
                  {curatedIdeas.map((idea) => (
                    <div
                      key={idea.title}
                      className="flex items-start justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {idea.title}
                        </p>
                        <p className="text-sm text-slate-600">{idea.meta}</p>
                      </div>
                      <span className="text-xs font-semibold text-blue-600">
                        Explore
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl space-y-10 px-6 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                For buyers and sellers
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Move faster with a calmer, cleaner experience.
              </h2>
              <p className="text-slate-600">
                Choose your path, see the steps, and connect with vetted
                expertise without the clutter.
              </p>
            </div>

            <Link
              to="/properties"
              className="self-start rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-[1px] hover:bg-slate-800"
            >
              Start browsing
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featureHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.title}-card`}
                  className="group rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100">
                    <Icon size={20} />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100">
            <UserTypeSelector />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
