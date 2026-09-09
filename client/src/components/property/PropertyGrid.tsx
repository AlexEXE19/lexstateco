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
  getRequestProps?: (property: Property, index: number) => RequestItemProps;
  // Also only set by MyRequestsTab: the same property can appear more than
  // once (one tour request each), so property.id alone isn't a safe React
  // key there - the index ties each rendered card back to its own request.
  getKey?: (property: Property, index: number) => string | number;
}> = ({ properties, isSaved, onSelect, getRequestProps, getKey }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property, index) => (
        <PropertyCard
          key={getKey ? getKey(property, index) : property.id}
          property={property}
          saved={isSaved(property.id)}
          onSelect={onSelect}
          {...getRequestProps?.(property, index)}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
