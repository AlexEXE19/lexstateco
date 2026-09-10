import { Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import PropertyGrid from "../PropertyGrid";
import TabHeader from "../../../../components/common/TabHeader";
import EmptyState from "../../../../components/common/EmptyState";

import { RootState } from "../../../../state/store";
import { useUserProperties } from "../../hooks/useUserProperties";
import { useTranslation } from "../../../../utils/i18n";
import { useNavigate } from "react-router-dom";

const UserPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { properties } = useUserProperties(userId);
  const { t } = useTranslation();
  const navigate = useNavigate();

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
          onSelect={(property) => {
            navigate(`/properties/${property.id}`);
          }}
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
