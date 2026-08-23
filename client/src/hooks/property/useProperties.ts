import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { Property, Filter } from "../../types/types";

// useProperties.ts
export const useProperties = (currentUser: any) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [propRes, savedRes] = await Promise.all([
          axios.get<Property[]>(`${baseURL}/properties`),
          currentUser.id !== "-1"
            ? axios.get(`${baseURL}/saved-properties/${currentUser.id}`)
            : Promise.resolve({ data: [] }),
        ]);

        const allProps = propRes.data;
        setProperties(allProps);

        setFilteredProperties(allProps);

        if (savedRes.data) {
          setSavedIds(savedRes.data.map((obj: any) => Number(obj.propertyId)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser.id]);

  const applyFilters = (filters: Filter) => {
    let filtered = [...properties];

    if (filters.location) {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= parseInt(filters.minPrice));
    }
    if (filters.neighborhood) {
      filtered = filtered.filter((p) =>
        p.neighborhood
          .toLowerCase()
          .includes(filters.neighborhood.toLowerCase()),
      );
    }

    setFilteredProperties(filtered);
  };

  return { filteredProperties, savedIds, applyFilters, loading };
};
