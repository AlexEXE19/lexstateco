import { Link } from "react-router-dom";

import HomeHero from "../sections/HomeHero";
import HomeListings from "../sections/HomeListings";
import HomeSteps from "../sections/HomeSteps";
import { useTranslation } from "../utils/i18n";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-canvas">
      <HomeHero />
      <HomeListings />
      <HomeSteps />

      <section className="bg-primary-900">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="max-w-xl">
            <h2 className="font-display text-display-sm text-white">
              {t("home.section.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-primary-100">
              {t("home.section.desc")}
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-primary-900 transition-colors hover:bg-primary-50"
          >
            {t("home.section.cta")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
