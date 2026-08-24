import { Clock3, MapPin, ShieldCheck } from "lucide-react";
import HomeFeatureSection from "../sections/HomeFeatureSection";
import { useTranslation } from "../utils/i18n";

const GetStartedPage: React.FC = () => {
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

  return (
    <div className="relative overflow-hidden bg-background text-slate-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/homepage.jpg')] bg-cover bg-[center_top_15%]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-surface/90 to-secondary-900/70" />
      </div>
      <div className="relative">
        <HomeFeatureSection featureHighlights={featureHighlights} />
      </div>
    </div>
  );
};

export default GetStartedPage;
