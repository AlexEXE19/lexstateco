import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { Property } from "../../schemas/Property";

export const useSavedProperties = (userId: string) => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (userId === "-1") return;
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
        setProperties(propertyResponses.map((res) => res.data));
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };
    fetchSavedProperties();
  }, [userId]);

  return { properties };
};
