import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "../../types/types";
import baseURL from "../../config/baseUrl";

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

  return (
    <div className="overflow-hidden rounded-2xl bg-background-surface/80 ring-1 ring-white/10">
      <div className="relative h-64 w-full">
        <img
          src={currentImage}
          alt={property.title}
          className="h-full w-full object-cover"
        />
        {imageCount > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((i) => (i - 1 + imageCount) % imageCount)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % imageCount)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {property.imageRefs.slice(0, 8).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 w-2 rounded-full ${
                    idx === activeIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyImageGallery;
