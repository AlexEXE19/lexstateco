import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PropertyGrid from "./PropertyGrid";
import TabHeader from "../common/TabHeader";
import EmptyState from "../common/EmptyState";

import { RootState } from "../../state/store";
import { openPropertyModal } from "../../state/propertyModal/propertyModalSlice";
import { useSavedProperties } from "../../hooks/property/useSavedProperties";
import { useTranslation } from "../../utils/i18n";

const SavedPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { properties } = useSavedProperties(userId);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasProperties = properties && properties.length > 0;

  return (
    <div className="space-y-6">
      <TabHeader
        icon={Heart}
        eyebrow={t("account.tabs.saved")}
        title={t("saved.title")}
        description={hasProperties ? t("saved.subtitle") : undefined}
      />

      {hasProperties ? (
        <PropertyGrid
          properties={properties}
          isSaved={() => true}
          onSelect={(property) => {
            dispatch(openPropertyModal(property));
            navigate(`/properties/${property.id}`);
          }}
        />
      ) : (
        <EmptyState
          icon={Heart}
          title={t("saved.cta")}
          actionLabel={t("saved.browse")}
          actionTo="/properties"
        />
      )}
    </div>
  );
};

export default SavedPropertiesTab;
