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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="relative h-[520px] w-full max-w-4xl overflow-hidden rounded-lg border border-line bg-background-surface">
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
