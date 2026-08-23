import { CalendarClock, Mail, MapPin, Phone } from "lucide-react";
import Map from "../common/Map";
import { Property, TourRequest } from "../../types/types";
import { statusColors, formatDateTime } from "../../utils/tourRequestStatus";
import { useTranslation } from "../../utils/i18n";

interface AudienceRequestDetailPanelProps {
  request: TourRequest;
  property: Property;
  heroImage: string;
  updating: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const AudienceRequestDetailPanel: React.FC<
  AudienceRequestDetailPanelProps
> = ({ request, property, heroImage, updating, onAccept, onReject }) => {
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

      <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <CalendarClock size={14} />
            {formatDateTime(request.requestedAt)}
          </span>
          {request.requester && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              <Mail size={14} />
              {request.requester.email}
            </span>
          )}
          {request.requester && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              <Phone size={14} />
              {request.requester.phone}
            </span>
          )}
        </div>
        {property.description}
      </div>

      <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs uppercase text-slate-400">
            {t("audience.price")}
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
            {t("audience.size")}
          </p>
          <p className="text-lg font-semibold text-white">
            {property.size} sq ft
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs uppercase text-slate-400">
            {t("audience.neighborhood")}
          </p>
          <p className="text-lg font-semibold text-white">
            {property.neighborhood}
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs uppercase text-slate-400">
            {t("audience.zip")}
          </p>
          <p className="text-lg font-semibold text-white">
            {property.zipCode}
          </p>
        </div>
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

      {request.status === "pending" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAccept}
            disabled={updating}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-[1px] hover:bg-emerald-400 disabled:opacity-70"
          >
            {updating ? t("audience.updating") : t("audience.accept")}
          </button>
          <button
            onClick={onReject}
            disabled={updating}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:-translate-y-[1px] hover:bg-rose-400 disabled:opacity-70"
          >
            {updating ? t("audience.updating") : t("audience.reject")}
          </button>
        </div>
      )}
    </>
  );
};

export default AudienceRequestDetailPanel;
