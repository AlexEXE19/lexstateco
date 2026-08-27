import PropertyListingForm from "../forms/PropertyListingForm";
import { useTranslation } from "../../utils/i18n";

// Tab for listing a property
const PropertyListingTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
          List a property
        </p>
        <h2 className="text-3xl font-semibold">{t("listing.title")}</h2>
        <p className="text-sm text-slate-300">{t("listing.subtitle")}</p>
      </div>

      <PropertyListingForm />
    </div>
  );
};

export default PropertyListingTab;
