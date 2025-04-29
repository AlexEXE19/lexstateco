import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import { Property } from "../types/types";

const SavedPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);

  const [savedProperties, setSavedProperties] = useState<Property[]>();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const savedResponse = await axios.get(
          `http://localhost:5000/saved-properties/${userId}`
        );

        const propertyIds = savedResponse.data.map(
          (propertyIdObject: { property_id: string }) =>
            propertyIdObject.property_id
        );

        const propertyPromises = propertyIds.map((id: string) =>
          axios.get(`http://localhost:5000/properties/${id}`)
        );

        const propertyResponses = await Promise.all(propertyPromises);

        const saved = propertyResponses.map((res) => res.data[0]);

        setSavedProperties(saved);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };
    fetchSavedProperties();
  });

  return (
    <div>
      {savedProperties && savedProperties.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Saved Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={true}
              />
            ))}
          </div>
        </>
      ) : (
        <h2 className="text-xl font-semibold mb-4">
          Let's find some nice properties!
        </h2>
      )}
    </div>
  );
};

export default SavedPropertiesTab;
