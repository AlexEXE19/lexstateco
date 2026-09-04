import { Coords } from "../components/common/Map";

export const FALLBACK_COORDS = { lat: 44.4323, lng: 26.1063 };

export const getUserLocation = (): Promise<Coords> => {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(FALLBACK_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error.message);
        resolve(FALLBACK_COORDS);
      },
      {
        timeout: 10000,
        maximumAge: 0,
        enableHighAccuracy: true,
      },
    );
  });
};
