import { TourRequest } from "../../types/types";
import { statusColors, formatDateTime } from "../../utils/tourRequestStatus";
import baseURL from "../../config/baseUrl";

interface TourRequestListItemProps {
  request: TourRequest;
  active: boolean;
  onSelect: () => void;
  actions?: React.ReactNode;
}

// Shared list-row between MyRequestsTab and MyAudienceTab. `actions` is an
// optional slot for role-specific buttons (e.g. MyRequestsTab's cancel
// button) rendered under the location/date lines.
const TourRequestListItem: React.FC<TourRequestListItemProps> = ({
  request,
  active,
  onSelect,
  actions,
}) => {
  const property = request.Property;
  const thumb = property?.imageRefs?.[0]
    ? `${baseURL.replace(/\/$/, "")}/${property.imageRefs[0]}`
    : "/default_house.jpg";

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-background-surface/80 to-background-surface/40 p-3 text-left transition hover:-translate-y-[1px] hover:border-secondary-300/30 hover:shadow-lg hover:shadow-secondary-500/10 ${
        active ? "ring-2 ring-secondary-400" : ""
      }`}
    >
      <div className="h-20 w-28 overflow-hidden rounded-xl bg-background-elevated">
        <img
          src={thumb}
          alt={property?.title || "Property"}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            {property?.title || "Property"}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              statusColors[request.status] || "bg-white/10 text-white"
            }`}
          >
            {request.status}
          </span>
        </div>
        <p className="text-xs text-slate-300">
          {property?.location || "Location"}
        </p>
        <p className="text-xs text-slate-400">
          {formatDateTime(request.requestedAt)}
        </p>
        {actions}
      </div>
    </button>
  );
};

export default TourRequestListItem;
