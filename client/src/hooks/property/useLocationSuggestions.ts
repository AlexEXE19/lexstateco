import { useEffect } from "react";

export const useLocationSuggestions = (
  query: string | undefined,
  setSuggestions: (suggestions: any[]) => void,
) => {
  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const fetchLocations = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=en`,
            {
              headers: {
                "User-Agent": "MyPropertyApp/1.0",
              },
            },
          );
          const data = await response.json();
          const cityNames = [
            ...new Set(data.map((obj: any) => obj.display_name)),
          ];
          setSuggestions(cityNames);
        } catch (error) {
          console.error("Autocomplete fetch error:", error);
          setSuggestions([]);
        }
      };

      fetchLocations();
    }, 100);

    return () => clearTimeout(timer);
  }, [query, setSuggestions]);
};
