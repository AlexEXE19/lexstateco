import PropertyCard from "./PropertyCard";
import { Property } from "../../types/types";

const PropertyGrid: React.FC<{ properties: Property[]; saved: boolean }> = ({
  properties,
  saved,
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    {properties.map((property) => (
      <PropertyCard key={property.id} property={property} saved={saved} />
    ))}
  </div>
);

export default PropertyGrid;
