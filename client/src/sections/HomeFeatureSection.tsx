import { Link } from "react-router-dom";

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
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">{t("home.section.label")}</p>
            <h2 className="mt-3 font-display text-display-sm text-ink">
              {t("home.section.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              {t("home.section.desc")}
            </p>
          </div>

          <Link to="/properties" className="btn-primary">
            {t("home.section.cta")}
          </Link>
        </div>

        <div className="mt-14 grid gap-px border-t border-line md:grid-cols-3">
          {featureHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="border-b border-line py-8 pr-8 md:border-b-0 md:border-r md:pl-8 md:first:pl-0 md:last:border-r-0"
              >
                <Icon size={18} className="text-primary-700" />
                <p className="mt-4 text-lg text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatureSection;
