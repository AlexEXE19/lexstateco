import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { Property, Filter } from "../../types/types";

// Filtering happens server-side (GET /properties supports location,
// neighborhood, minPrice, maxPrice as optional query params) so this hook
// just forwards whatever filters are set instead of fetching everything
// and narrowing it down in the browser.
const buildFilterParams = (filters?: Filter) => {
  const params: Record<string, string> = {};
  if (!filters) return params;

  if (filters.location) params.location = filters.location;
  if (filters.neighborhood) params.neighborhood = filters.neighborhood;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;

  return params;
};

export const useProperties = (currentUser: any) => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async (filters?: Filter) => {
    const res = await axios.get<Property[]>(`${baseURL}/properties`, {
      params: buildFilterParams(filters),
    });
    setFilteredProperties(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [, savedRes] = await Promise.all([
          fetchProperties(),
          currentUser.id !== "-1"
            ? axios.get(`${baseURL}/saved-properties/${currentUser.id}`)
            : Promise.resolve({ data: [] }),
        ]);

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

  const applyFilters = async (filters: Filter) => {
    setLoading(true);
    try {
      await fetchProperties(filters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { filteredProperties, savedIds, applyFilters, loading };
};
