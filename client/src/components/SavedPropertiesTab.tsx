import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { HousePlus } from "lucide-react";
import PropertyCard from "./PropertyCard";
import { Property } from "../types/types";
import { RootState } from "../state/store";
import baseURL from "../config/baseUrl";

// Tab showing user's saved properties
const SavedPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);

  const [savedProperties, setSavedProperties] = useState<Property[]>();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const savedResponse = await axios.get(
          `${baseURL}/saved-properties/${userId}`,
        );

        const propertyIds = savedResponse.data.map(
          (propertyIdObject: { propertyId: string }) =>
            propertyIdObject.propertyId,
        );

        const propertyPromises = propertyIds.map((id: string) =>
          axios.get(`${baseURL}/properties/${id}`),
        );

        const propertyResponses = await Promise.all(propertyPromises);

        const saved = propertyResponses.map((res) => res.data);

        setSavedProperties(saved);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };
    fetchSavedProperties();
  }, [userId]);

  return (
    <div className="space-y-6">
      {savedProperties && savedProperties.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Saved
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Your Saved Properties
              </h2>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
            >
              <HousePlus size={16} />
              Discover more
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-200">
          Let's find some nice properties!
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesTab;
