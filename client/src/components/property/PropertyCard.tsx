import { useState } from "react";
import {
  Bookmark,
  Home,
  MapPin,
  Phone,
  Tag,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Property } from "../../types/types";
import { usePropertyCardData } from "../../hooks/property/usePropertyCardData";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import DeletePropertyModal from "./DeletePropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import { useTranslation } from "../../utils/i18n";

// Property card holds the information about a property
const PropertyCard: React.FC<{
  property: Property;
  saved: boolean;
  selected?: boolean;
  onSelect?: (property: Property) => void;
}> = ({ property, saved, selected = false, onSelect }) => {
  const { t } = useTranslation();
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);

  const {
    currentUser,
    sellerName,
    sellerPhone,
    loading,
    isSaved,
    deleted,
    setDeleted,
    activeImage,
    setActiveImage,
    handleSaveClick,
    priceLabel,
    imageCount,
    currentImage,
    nextImage,
  } = usePropertyCardData(property, saved);

  const isOwner = String(property.sellerId) === String(currentUser.id);

  if (loading) {
    return <PropertyCardSkeleton />;
  }

  if (deleted) {
    return null;
  }

  return (
    <div
      onClick={() => onSelect?.(property)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl ${
        selected ? "ring-2 ring-primary-400/70" : "ring-1 ring-white/10"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={currentImage}
          alt={property.title}
          className="h-44 w-full object-cover"
        />
        {imageCount > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white shadow"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white shadow"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background-surface/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Home size={14} />
          <span>
            {property.size} {t("properties.size.unit")}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white shadow">
          {priceLabel}
        </div>
        {imageCount > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {property.imageRefs?.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(idx);
                }}
                className={`h-2 w-2 rounded-full ${
                  idx === activeImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {property.title}
            </h2>
          </div>
          {!isOwner && (
            <button
              onClick={handleSaveClick}
              className="rounded-full p-1 transition hover:bg-white/10"
              aria-label={
                isSaved
                  ? t("properties.actions.unsave")
                  : t("properties.actions.save")
              }
            >
              <Bookmark
                size={18}
                className={`transition ${
                  isSaved
                    ? "text-secondary-300 drop-shadow"
                    : "text-slate-300 group-hover:text-white"
                }`}
              />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <MapPin size={12} /> {property.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Tag size={12} /> {property.neighborhood}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Tag size={12} /> {property.zipCode}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Phone size={12} /> {sellerPhone || t("common.na")}
          </span>
        </div>

        <div className="text-xs text-slate-300">
          {t("properties.listedBy")}{" "}
          {sellerName || t("properties.listedBy.agent")}
        </div>
      </div>

      {isOwner && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalType("edit");
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-[1px] hover:border-white/30 hover:bg-white/12"
          >
            <Pencil size={14} />
            {t("properties.actions.edit")}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalType("delete");
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/50 bg-white/5 px-4 py-2 text-sm font-semibold text-red-50 shadow-lg shadow-black/20 transition hover:-translate-y-[1px] hover:bg-red-500/20 hover:border-red-400"
          >
            <Trash2 size={14} />
            {t("properties.actions.delete")}
          </button>
        </div>
      )}

      {modalType === "edit" && (
        <EditPropertyModal
          property={property}
          onCancel={() => setModalType(null)}
          onSaved={() => setModalType(null)}
        />
      )}
      {modalType === "delete" && (
        <DeletePropertyModal
          property={property}
          onCancel={() => setModalType(null)}
          onDeleted={() => {
            setModalType(null);
            setDeleted(true);
          }}
        />
      )}
    </div>
  );
};

export default PropertyCard;
