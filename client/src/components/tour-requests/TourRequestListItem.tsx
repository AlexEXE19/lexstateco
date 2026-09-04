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
      className={`flex w-full items-center gap-4 rounded-md border bg-background-surface p-3 text-left transition-colors ${
        active
          ? "border-primary-300 bg-primary-50"
          : "border-line hover:bg-background-elevated"
      }`}
    >
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-background-muted">
        <img
          src={thumb}
          alt={property?.title || "Property"}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">
            {property?.title || "Property"}
          </p>
          <span
            className={`rounded border px-2 py-0.5 text-xs capitalize ${
              statusColors[request.status] || "border-line text-ink-muted"
            }`}
          >
            {request.status}
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          {property?.location || "Location"}
        </p>
        <p className="text-xs text-ink-subtle">
          {formatDateTime(request.requestedAt)}
        </p>
        {actions}
      </div>
    </button>
  );
};

export default TourRequestListItem;
