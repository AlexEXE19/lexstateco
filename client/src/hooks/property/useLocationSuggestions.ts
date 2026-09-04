import { useEffect } from "react";
import { parseNominatimAddress } from "../../utils/norminatimParsings";

export const useLocationSuggestions = (
  query: string | undefined,
  setSuggestions: (suggestions: any[]) => void,
  toggle: boolean,
) => {
  useEffect(() => {
    return;
    if (!query || !toggle) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${query}&format=json&addressdetails=1&limit=3&accept-language=en`,
          {
            headers: {
              "User-Agent": "MyPropertyApp/1.0",
            },
          },
        );
        const data = await response.json();
        if (data.length) {
          const uniqueMap = new Map();
          data.forEach((obj: any) => {
            const parsed = parseNominatimAddress(obj.address);
            if (parsed.city) {
              const key = `${parsed.city}-${parsed.county}-${parsed.country}`;
              if (!uniqueMap.has(key)) {
                uniqueMap.set(key, parsed);
              }
            }
          });

          setSuggestions(Array.from(uniqueMap.values()));
        }
      } catch (error) {
        console.error("Autocomplete fetch error:", error);
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [query, setSuggestions, toggle]);
};
