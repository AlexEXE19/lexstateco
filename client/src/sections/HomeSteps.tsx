import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CalendarCheck,
  Key,
  HousePlus,
  UserCheck,
  BadgeDollarSign,
} from "lucide-react";

import { getCurrentUser } from "../utils/auth";
import { useTranslation } from "../utils/i18n";

type Audience = "buyer" | "seller";

// One path at a time: buyers and sellers want different things, and showing
// both sets of steps at once is what made this section feel cluttered.
const HomeSteps: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [audience, setAudience] = useState<Audience>("buyer");

  const steps =
    audience === "buyer"
      ? [
          { title: t("steps.buyer.1.title"), desc: t("steps.buyer.1.desc"), icon: Search },
          { title: t("steps.buyer.2.title"), desc: t("steps.buyer.2.desc"), icon: CalendarCheck },
          { title: t("steps.buyer.3.title"), desc: t("steps.buyer.3.desc"), icon: Key },
        ]
      : [
          { title: t("steps.seller.1.title"), desc: t("steps.seller.1.desc"), icon: HousePlus },
          { title: t("steps.seller.2.title"), desc: t("steps.seller.2.desc"), icon: UserCheck },
          { title: t("steps.seller.3.title"), desc: t("steps.seller.3.desc"), icon: BadgeDollarSign },
        ];

  const goToAudienceStart = () => {
    if (audience === "buyer") {
      navigate("/properties");
      return;
    }
    navigate(
      getCurrentUser() ? "/profile/manage?activeTab=list" : "/register",
    );
  };

  return (
    <section className="border-b border-line bg-background-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">
              {audience === "buyer"
                ? t("steps.label.buyer")
                : t("steps.label.seller")}
            </p>
            <h2 className="mt-3 font-display text-display-sm text-ink">
              {audience === "buyer"
                ? t("steps.title.buyer")
                : t("steps.title.seller")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              {t("steps.subtitle")}
            </p>
          </div>

          <div className="inline-flex rounded-md border border-line p-0.5">
            {(["buyer", "seller"] as Audience[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAudience(option)}
                className={`rounded px-4 py-2 text-sm transition-colors ${
                  audience === option
                    ? "bg-primary-800 font-medium text-white"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {option === "buyer"
                  ? t("userType.buyer.title")
                  : t("userType.seller.title")}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-12 grid gap-px border-y border-line sm:grid-cols-3 sm:border sm:border-line">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="border-b border-line bg-background-surface p-7 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-primary-700" />
                  <span className="text-[11px] uppercase tracking-label text-ink-subtle">
                    {t("steps.step")} {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.desc}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10">
          <button type="button" onClick={goToAudienceStart} className="btn-primary">
            {audience === "buyer"
              ? t("home.section.cta")
              : t("home.hero.listProperty")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeSteps;
