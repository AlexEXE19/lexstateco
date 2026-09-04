import { Property } from "../../schemas/Property";
import { TourRequest } from "../../schemas/TourRequest";
import PropertyCard from "./PropertyCard";

interface RequestItemProps {
  requestStatus?: TourRequest["status"];
  onCancelRequest?: () => void;
  cancelingRequest?: boolean;
}

const PropertyGrid: React.FC<{
  properties: Property[];
  isSaved: (propertyId: string) => boolean;
  onSelect?: (property: Property) => void;
  // Only set by MyRequestsTab, so each card can carry its own request's
  // status/cancel action - every other tab lists plain properties.
  getRequestProps?: (property: Property) => RequestItemProps;
}> = ({ properties, isSaved, onSelect, getRequestProps }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          saved={isSaved(property.id)}
          onSelect={onSelect}
          {...getRequestProps?.(property)}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
