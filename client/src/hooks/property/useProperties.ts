import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import baseURL from "../../config/baseUrl";
import { Filter } from "../../schemas/Filter";
import { Property } from "../../schemas/Property";
import { User } from "../../schemas/User";

// Filtering happens server-side (GET /properties supports location,
// neighborhood, minPrice, maxPrice as optional query params) so this hook
// just forwards whatever filters are set instead of fetching everything
// and narrowing it down in the browser.
const buildFilterParams = (filters?: Partial<Filter>) => {
  const params: Record<string, string> = {};
  if (!filters) return params;

  if (filters.location) params.location = filters.location;
  if (filters.neighborhood) params.neighborhood = filters.neighborhood;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;

  return params;
};

export const useProperties = (currentUser: User) => {
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>();
  const [loading, setLoading] = useState(true);

  const fetchProperties = async (filters?: Partial<Filter>) => {
    const res = await axios.get<Property[]>(`${baseURL}/properties`, {
      params: buildFilterParams(filters),
    });

    setFilteredProperties(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Seed the very first fetch from whatever's already in the URL
        // (e.g. /properties?location=Rivertown from the home page search),
        // so there's exactly one fetch on mount instead of an unfiltered
        // one immediately followed by a filtered one racing to overwrite
        // it.
        const initialFilters: Partial<Filter> = {
          location: searchParams.get("location") ?? undefined,
          neighborhood: searchParams.get("neighborhood") ?? undefined,
          minPrice: searchParams.get("minPrice") ?? undefined,
          maxPrice: searchParams.get("maxPrice") ?? undefined,
        };

        const [, savedRes] = await Promise.all([
          fetchProperties(initialFilters),
          currentUser.id !== "-1"
            ? axios.get(`${baseURL}/saved-properties/${currentUser.id}`)
            : Promise.resolve({ data: [] }),
        ]);

        if (savedRes.data) {
          setSavedIds(new Set(savedRes.data.map((obj: any) => obj.propertyId)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // Deliberately only on mount / user change - re-running this every
    // time searchParams changes would refetch on every filter submit too,
    // which applyFilters already does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
