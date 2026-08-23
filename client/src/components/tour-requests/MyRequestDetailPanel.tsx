import { CalendarClock, MapPin } from "lucide-react";
import Map from "../common/Map";
import { Property, TourRequest } from "../../types/types";
import { statusColors, formatDateTime } from "../../utils/tourRequestStatus";
import { useTranslation } from "../../utils/i18n";

interface MyRequestDetailPanelProps {
  request: TourRequest;
  property: Property;
  heroImage: string;
}

const MyRequestDetailPanel: React.FC<MyRequestDetailPanelProps> = ({
  request,
  property,
  heroImage,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
        <img
          src={heroImage}
          alt={property.title}
          className="h-64 w-full object-cover"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            {property.title}
          </h3>
          <p className="text-sm text-slate-300">{property.location}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            statusColors[request.status] || "bg-white/10 text-white"
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
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
        </div>
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs uppercase text-slate-400">
            {t("properties.label.size")}
          </p>
          <p className="text-lg font-semibold text-white">
            {property.size} sq ft
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs uppercase text-slate-400">
            {t("properties.label.neighborhood")}
          </p>
          <p className="text-lg font-semibold text-white">
            {property.neighborhood}
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs uppercase text-slate-400">
            {t("properties.label.zip")}
          </p>
          <p className="text-lg font-semibold text-white">
            {property.zipCode}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
          <CalendarClock size={14} />
          <span>{formatDateTime(request.requestedAt)}</span>
        </div>
        <p className="text-xs uppercase text-slate-400">
          {t("audience.zip")}
        </p>
        {property.description}
      </div>

      <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <MapPin size={14} />
          <span>{t("audience.map")}</span>
        </div>
        <div className="h-64 overflow-hidden rounded-xl bg-slate-900/90 ring-1 ring-white/10">
          <Map
            location={property.location}
            label={property.title}
            zoom={12}
          />
        </div>
      </div>
    </>
  );
};

export default MyRequestDetailPanel;
