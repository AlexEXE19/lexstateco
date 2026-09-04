import { Home } from "lucide-react";

import PropertyListingForm from "../forms/PropertyListingForm";
import TabHeader from "../common/TabHeader";

import { useTranslation } from "../../utils/i18n";

// Tab for listing a property
const PropertyListingTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <TabHeader
        icon={Home}
        eyebrow={t("account.tabs.list")}
        title={t("listing.title")}
        description={t("listing.subtitle")}
      />

      <PropertyListingForm />
    </div>
  );
};

export default PropertyListingTab;
