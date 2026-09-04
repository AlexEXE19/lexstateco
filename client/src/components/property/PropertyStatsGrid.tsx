import { Phone } from "lucide-react";

import { useTranslation } from "../../utils/i18n";
import { Property } from "../../schemas/Property";

interface PropertyStatsGridProps {
  property: Property;
  sellerName: string;
  sellerPhone: string;
}

// A spec sheet rather than a grid of cards - hairline rules keep the
// numbers scannable without boxing every value.
const PropertyStatsGrid: React.FC<PropertyStatsGridProps> = ({
  property,
  sellerName,
  sellerPhone,
}) => {
  const { t } = useTranslation();

  const rows = [
    {
      label: t("properties.label.price"),
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(property.price),
      hint: t("properties.price.includesFees"),
    },
    {
      label: t("properties.label.size"),
      value: `${property.size} ${t("properties.size.unit")}`,
      hint: t("properties.size.hint"),
    },
    {
      label: t("properties.label.neighborhood"),
      value: property.location.neighborhood,
      hint: t("properties.neighborhood.hint"),
    },
    {
      label: t("properties.label.zip"),
      value: property.location.zipCode,
      hint: t("properties.zip.hint"),
    },
  ];

  return (
    <div>
      <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="border-b border-line py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
          >
            <dt className="eyebrow">{row.label}</dt>
            <dd className="mt-1.5 font-display text-lg text-ink">
              {row.value}
            </dd>
            <p className="mt-0.5 text-xs text-ink-subtle">{row.hint}</p>
          </div>
        ))}
      </dl>

      <div className="mt-6 border border-line p-5">
        <p className="eyebrow">{t("properties.label.seller")}</p>
        <p className="mt-1.5 text-base text-ink">
          {sellerName || t("properties.listedBy.agent")}
        </p>
        {sellerPhone && (
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
            <Phone size={14} className="text-ink-subtle" />
            {sellerPhone}
          </p>
        )}
        <p className="mt-2 text-xs text-ink-subtle">
          {t("properties.seller.hint")}
        </p>
      </div>
    </div>
  );
};

export default PropertyStatsGrid;
