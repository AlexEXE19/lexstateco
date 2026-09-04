import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import baseURL from "../../config/baseUrl";
import { Property } from "../../schemas/Property";

const PropertyImageGallery: React.FC<{ property: Property }> = ({
  property,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [property.id]);

  const imageCount = property.imageRefs?.length || 0;
  const currentImage = imageCount
    ? `${baseURL.replace(/\/$/, "")}/${property.imageRefs[activeIndex % imageCount]}`
    : "/default_house.jpg";

  const alt = `${property.location.neighborhood}, ${property.location.city}`;

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-background-muted">
        <img src={currentImage} alt={alt} className="h-full w-full object-cover" />

        {imageCount > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={() =>
                setActiveIndex((i) => (i - 1 + imageCount) % imageCount)
              }
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-background-surface/90 text-ink transition-colors hover:bg-background-surface"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next photo"
              onClick={() => setActiveIndex((i) => (i + 1) % imageCount)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-background-surface/90 text-ink transition-colors hover:bg-background-surface"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {imageCount > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {property.imageRefs.slice(0, 8).map((ref, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-16 w-24 shrink-0 overflow-hidden border transition-colors ${
                idx === activeIndex ? "border-ink" : "border-line"
              }`}
            >
              <img
                src={`${baseURL.replace(/\/$/, "")}/${ref}`}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;
