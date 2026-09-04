import { Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import PropertyGrid from "./PropertyGrid";
import TabHeader from "../common/TabHeader";
import EmptyState from "../common/EmptyState";

import { RootState } from "../../state/store";
import { openPropertyModal } from "../../state/propertyModal/propertyModalSlice";
import { useUserProperties } from "../../hooks/property/useUserProperties";
import { useTranslation } from "../../utils/i18n";

const UserPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { properties } = useUserProperties(userId);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hasProperties = properties && properties.length > 0;

  return (
    <div className="space-y-6">
      <TabHeader
        icon={Building2}
        eyebrow={t("account.tabs.myProperties")}
        title={t("userProps.title")}
        description={hasProperties ? t("userProps.subtitle") : undefined}
      />

      {hasProperties ? (
        <PropertyGrid
          properties={properties}
          isSaved={() => false}
          onSelect={(property) => dispatch(openPropertyModal(property))}
        />
      ) : (
        <EmptyState
          icon={Building2}
          title={t("userProps.empty")}
          actionLabel={t("userProps.listCta")}
          actionTo="/profile/manage?activeTab=list"
        />
      )}
    </div>
  );
};

export default UserPropertiesTab;
