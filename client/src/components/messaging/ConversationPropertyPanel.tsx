import { useState } from "react";
import Map from "../common/Map";
import { Property } from "../../types/types";
import baseURL from "../../config/baseUrl";
import { useTranslation } from "../../utils/i18n";

const ConversationPropertyPanel: React.FC<{ property: Property }> = ({
  property,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
      <button
        onClick={() => setShowDetails((v) => !v)}
        className="flex w-full items-center justify-between bg-slate-900/60 px-4 py-3 text-left text-slate-100"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {t("properties.details")}
          </p>
          <p className="text-lg font-semibold">{property.title}</p>
          <p className="text-sm text-slate-300">{property.location}</p>
        </div>
        <span className="text-xs text-blue-200 underline">
          {showDetails ? t("common.hide") : t("common.show")}
        </span>
      </button>
      {showDetails && (
        <div className="grid gap-4 bg-slate-900/80 p-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2">
            <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
              <img
                src={
                  property.imageRefs?.[0]
                    ? `${baseURL.replace(/\/$/, "")}/${property.imageRefs[0]}`
                    : "/default_house.jpg"
                }
                alt={property.title}
                className="h-52 w-full object-cover"
              />
            </div>
            <p className="text-sm text-slate-200">{property.description}</p>
          </div>
          <div className="h-52 overflow-hidden rounded-xl ring-1 ring-white/10">
            <Map
              location={property.location}
              label={property.title}
              zoom={12}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationPropertyPanel;
