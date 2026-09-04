import { Property } from "../../schemas/Property";
import PropertyCard from "./PropertyCard";

const PropertyGrid: React.FC<{
  properties: Property[];
  isSaved: (propertyId: string) => boolean;
  onSelect?: (property: Property) => void;
}> = ({ properties, isSaved, onSelect }) => {
  return (
    <div className="mx-auto w-1/2  flex flex-col">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          saved={isSaved(property.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
