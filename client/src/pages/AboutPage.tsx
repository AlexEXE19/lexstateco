import { Clock3, MapPin, ShieldCheck } from "lucide-react";
import HomeFeatureSection from "../sections/HomeFeatureSection";
import { useTranslation } from "../utils/i18n";

const AboutPage: React.FC = () => {
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
    <div className="bg-background text-slate-50">
      <HomeFeatureSection featureHighlights={featureHighlights} />
    </div>
  );
};

export default AboutPage;
