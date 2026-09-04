import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLocationApi } from "../../hooks/property/useLocationApi";
import { buildQuery } from "../../utils/buildQuery";

export interface MapProps {
  coords: Coords;
  setAddress: (param: any) => void;
  label?: string;
  zoom?: number;
  onClose: () => void;
}

export interface Coords {
  lat: number;
  lng: number;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationClickPicker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  return null;
}

function MapSearchFlyTo({ searchCoords }: { searchCoords: Coords | null }) {
  const map = useMap();
  useEffect(() => {
    if (searchCoords) {
      map.flyTo([searchCoords.lat, searchCoords.lng], 13, { duration: 0.65 });
    }
  }, [searchCoords, map]);
  return null;
}

const Map: React.FC<MapProps> = ({
  coords,
  setAddress,
  zoom = 13,
  onClose,
}) => {
  const [label, setLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCoords, setCurrentCoords] = useState<Coords>(coords);
  const { getAddressByCoordinates, getCoordinatesByQuery } = useLocationApi();

  const handleClick = async (e: any) => {
    e.stopPropagation();
    const address = await getAddressByCoordinates(currentCoords);
    setAddress(address);
  };

  const eventHandlers = {
    dragend(e: any) {
      const marker = e.target;
      const newPos = marker.getLatLng();
      setCurrentCoords({ lat: newPos.lat, lng: newPos.lng });
    },
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery) return;

    const stringQuery = buildQuery({ q: searchQuery.trim() });
    const coords = await getCoordinatesByQuery(stringQuery);
    if (coords) {
      setCurrentCoords(coords);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const address = await getAddressByCoordinates(currentCoords);
        if (address) setLabel(address.address);
      } catch (err: any) {
        console.error(err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentCoords]);

  return (
    <div className="relative h-full w-full">
      <form
        onSubmit={handleSearch}
        className="absolute top-[10px] left-[50px] z-[1000] flex gap-2"
      >
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 shadow-[0_2px_6px_rgba(0,0,0,0.3)] bg-white outline-none w-[250px]"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
        >
          Search
        </button>
      </form>

      <div className="absolute bottom-5 right-5 z-[1000] flex gap-2.5">
        <button
          onClick={async (e) => {
            await handleClick(e);
            onClose();
          }}
          className="bg-blue-600 text-white px-4 py-2.5 rounded cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.3)] font-bold"
        >
          Select Location
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2.5 rounded cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.3)] font-bold"
        >
          Cancel
        </button>
      </div>

      <MapContainer
        center={[currentCoords.lat, currentCoords.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSearchFlyTo searchCoords={currentCoords} />
        <LocationClickPicker
          onLocationSelect={(lat, lng) => setCurrentCoords({ lat, lng })}
        />

        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={[currentCoords.lat, currentCoords.lng]}
        >
          <Popup autoClose={false} closeOnClick={false} closeButton={false}>
            <div className="p-2">
              <p className="text-sm font-medium">{label}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
