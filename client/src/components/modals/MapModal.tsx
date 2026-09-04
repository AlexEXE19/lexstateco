import { createPortal } from "react-dom";
import Map, { Coords } from "../common/Map";

interface MapModalProps {
  coords: Coords;
  onClose: () => void;
  setAddress: (param: any) => void;
}

export default function MapModal({
  coords,
  onClose,
  setAddress,
}: MapModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl h-[500px] rounded-lg overflow-hidden relative">
        <Map
          coords={coords}
          label="Harta misto"
          onClose={onClose}
          setAddress={setAddress}
        />
      </div>
    </div>,
    document.body,
  );
}
