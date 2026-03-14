import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MapProps = {
  location?: string;
  label?: string;
  zoom?: number;
};

type Coords = {
  lat: number;
  lng: number;
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter: Coords = { lat: 51.505, lng: -0.09 };

const jitterFromSeed = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // keep in 32-bit
  }

  const rand = (n: number) => {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x);
  };

  const delta = 0.02; // ~2km jitter at mid latitudes
  const latOffset = (rand(hash) - 0.5) * delta;
  const lngOffset = (rand(hash + 1) - 0.5) * delta;

  return { latOffset, lngOffset };
};

const Recenter: React.FC<{ center: Coords; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 0.65 });
  }, [center.lat, center.lng, map, zoom]);
  return null;
};

const Map: React.FC<MapProps> = ({
  location,
  label = "Here is the property",
  zoom = 13,
}) => {
  const [coords, setCoords] = useState<Coords | null>(null);

  const seed = useMemo(() => (location ? `${location}` : ""), [location]);

  useEffect(() => {
    if (!location) {
      setCoords(null);
      return undefined;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "LexEstateCo/1.0 (contact@lexestateco.local)",
            },
            signal: controller.signal,
          },
        );

        if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          setCoords(null);
          return;
        }

        const { lat, lon } = data[0];
        const base = {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        };

        const { latOffset, lngOffset } = jitterFromSeed(seed || `${lat}${lon}`);
        setCoords({ lat: base.lat + latOffset, lng: base.lng + lngOffset });
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        console.error("Failed to geocode location", err);
        setCoords(null);
      }
    })();

    return () => controller.abort();
  }, [location, seed]);

  const center = coords || defaultCenter;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} zoom={zoom} />
      {coords && (
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>{label}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
