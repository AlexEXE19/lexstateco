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
      <div className="overflow-hidden border border-line">
        <img
          src={heroImage}
          alt={property.title}
          className="h-64 w-full object-cover"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-ink">
            {property.title}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">{property.location}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            statusColors[request.status] || "border-line text-ink-muted"
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="border border-line p-4 text-sm text-ink-muted">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-2 rounded border border-line px-2.5 py-1">
            <CalendarClock size={14} />
            {formatDateTime(request.requestedAt)}
          </span>
          {request.requester && (
            <span className="inline-flex items-center gap-2 rounded border border-line px-2.5 py-1">
              <Mail size={14} />
              {request.requester.email}
            </span>
          )}
          {request.requester && (
            <span className="inline-flex items-center gap-2 rounded border border-line px-2.5 py-1">
              <Phone size={14} />
              {request.requester.phone}
            </span>
          )}
        </div>
        {property.description}
      </div>

      <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
        <div className="border-b border-line py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
          <p className="eyebrow">
            {t("audience.price")}
          </p>
          <p className="mt-1.5 font-display text-lg text-ink">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(property.price)}
          </p>
        </div>
        <div className="border-b border-line py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
          <p className="eyebrow">
            {t("audience.size")}
          </p>
          <p className="mt-1.5 font-display text-lg text-ink">
            {property.size} sq ft
          </p>
        </div>
        <div className="border-b border-line py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
          <p className="eyebrow">
            {t("audience.neighborhood")}
          </p>
          <p className="mt-1.5 font-display text-lg text-ink">
            {property.neighborhood}
          </p>
        </div>
        <div className="border-b border-line py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
          <p className="eyebrow">
            {t("audience.zip")}
          </p>
          <p className="mt-1.5 font-display text-lg text-ink">
            {property.zipCode}
          </p>
        </div>
      </dl>

      <div className="border border-line p-4">
        <div className="eyebrow mb-3 flex items-center gap-2">
          <MapPin size={14} />
          <span>{t("audience.map")}</span>
        </div>
        <div className="h-64 overflow-hidden border border-line">
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
            className="btn-primary"
          >
            {updating ? t("audience.updating") : t("audience.accept")}
          </button>
          <button
            onClick={onReject}
            disabled={updating}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
          >
            {updating ? t("audience.updating") : t("audience.reject")}
          </button>
        </div>
      )}
    </>
  );
};

export default AudienceRequestDetailPanel;
