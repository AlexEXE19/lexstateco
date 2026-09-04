import { parseNominatimAddress } from "../../utils/norminatimParsings";
import { Coords } from "../../components/common/Map";
export const useLocationApi = () => {
  const getCoordinatesByQuery = async (
    query: string,
  ): Promise<Coords | null> => {
    return null;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${query}&format=json&addressdetails=1&limit=5&accept-language=en`,
        {
          headers: {
            "User-Agent": "MyPropertyApp/1.0",
          },
        },
      );
      const data = await response.json();
      if (data.length) return { lat: data[0].lat, lng: data[0].lon };
      return null;
    } catch (error) {
      console.error("Autocomplete fetch error:", error);
      return null;
    }
  };

  const getAddressByCoordinates = async (coords: Coords) => {
    return null;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(coords.lat)}&lon=${encodeURIComponent(coords.lng)}&format=json&addressdetails=1&limit=5&accept-language=en`,
        {
          headers: {
            "User-Agent": "MyPropertyApp/1.0",
          },
        },
      );
      const data = await response.json();

      const address = parseNominatimAddress(data.address);
      return address;
    } catch (error) {
      console.error("Autocomplete fetch error:", error);
      return null;
    }
  };

  return {
    getCoordinatesByQuery,
    getAddressByCoordinates,
  };
};
