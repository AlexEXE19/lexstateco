import { useState } from "react";
import Map from "../common/Map";
import baseURL from "../../config/baseUrl";
import { useTranslation } from "../../utils/i18n";
import { Property } from "../../schemas/Property";

const ConversationPropertyPanel: React.FC<{ property: Property }> = ({
  property,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden border border-line">
      <button
        onClick={() => setShowDetails((v) => !v)}
        className="flex w-full items-center justify-between bg-background-surface px-4 py-3 text-left transition-colors hover:bg-background-elevated"
      >
        <div>
          <p className="eyebrow">
            {t("properties.details")}
          </p>
          <p className="text-lg font-semibold">{"titleeee"}</p>
          <p className="mt-1 text-sm text-ink">{property.location.address}</p>
        </div>
        <span className="text-xs text-primary-200 underline">
          {showDetails ? t("common.hide") : t("common.show")}
        </span>
      </button>
      {showDetails && (
        <div className="grid gap-4 border-t border-line p-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2">
            <div className="overflow-hidden border border-line">
              <img
                src={
                  property.imageRefs?.[0]
                    ? `${baseURL.replace(/\/$/, "")}/${property.imageRefs[0]}`
                    : "/default_house.jpg"
                }
                alt={"titlee"}
                className="h-52 w-full object-cover"
              />
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">{property.description}</p>
          </div>
          <div className="h-52 overflow-hidden border border-line">
            <Map
              location={property.location.address}
              label={"titlee"}
              zoom={12}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationPropertyPanel;
