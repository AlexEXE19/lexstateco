import { Property } from "../../types/types";
import { useTranslation } from "../../utils/i18n";

const PropertyStatsGrid: React.FC<{ property: Property }> = ({
  property,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-3 text-sm text-slate-200 sm:grid-cols-2">
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <p className="text-xs uppercase text-slate-400">
          {t("properties.label.price")}
        </p>
        <p className="text-lg font-semibold text-white">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(property.price)}
        </p>
        <p className="text-xs text-slate-400">
          {t("properties.price.includesFees")}
        </p>
      </div>
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <p className="text-xs uppercase text-slate-400">
          {t("properties.label.size")}
        </p>
        <p className="text-lg font-semibold text-white">
          {property.size} {t("properties.size.unit")}
        </p>
        <p className="text-xs text-slate-400">{t("properties.size.hint")}</p>
      </div>
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <p className="text-xs uppercase text-slate-400">
          {t("properties.label.neighborhood")}
        </p>
        <p className="text-lg font-semibold text-white">
          {property.neighborhood}
        </p>
        <p className="text-xs text-slate-400">
          {t("properties.neighborhood.hint")}
        </p>
      </div>
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <p className="text-xs uppercase text-slate-400">
          {t("properties.label.zip")}
        </p>
        <p className="text-lg font-semibold text-white">
          {property.zipCode}
        </p>
        <p className="text-xs text-slate-400">{t("properties.zip.hint")}</p>
      </div>
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:col-span-2">
        <p className="text-xs uppercase text-slate-400">
          {t("properties.label.seller")}
        </p>
        <p className="text-lg font-semibold text-white">
          ID #{property.sellerId}
        </p>
        <p className="text-xs text-slate-400">
          {t("properties.seller.hint")}
        </p>
      </div>
    </div>
  );
};

export default PropertyStatsGrid;
