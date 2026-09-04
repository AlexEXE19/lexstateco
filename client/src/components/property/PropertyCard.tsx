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
  X,
  BedDouble,
  Bath,
} from "lucide-react";
import { usePropertyCardData } from "../../hooks/property/usePropertyCardData";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import DeletePropertyModal from "./DeletePropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import { useTranslation } from "../../utils/i18n";
import { statusColors } from "../../utils/tourRequestStatus";
import { Property } from "../../schemas/Property";
import { TourRequest } from "../../schemas/TourRequest";

// Property card holds the information about a property
const PropertyCard: React.FC<{
  property: Property;
  saved: boolean;
  selected?: boolean;
  onSelect?: (property: Property) => void;
  // Only set by MyRequestsTab, so a request's own card can show its status
  // and be canceled directly, without opening the full details modal.
  requestStatus?: TourRequest["status"];
  onCancelRequest?: () => void;
  cancelingRequest?: boolean;
}> = ({
  property,
  saved,
  selected = false,
  onSelect,
  requestStatus,
  onCancelRequest,
  cancelingRequest = false,
}) => {
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

  const isOwner = String(property.agentId) === String(currentUser.id);

  if (loading) {
    return <PropertyCardSkeleton />;
  }

  if (deleted) {
    return null;
  }

  return (
    <div
      onClick={() => onSelect?.(property)}
      className={`group relative aspect-[3/1] flex w-full border border-white/10 cursor-pointer flex-row justify-between overflow-hidden   bg-white/5 text-white shadow-xl transition hover:border-blue-600 hover:shadow-2xl ${
        selected ? "ring-2 ring-primary-400/70" : "ring-1 ring-white/10"
      }`}
    >
      {/* Image/s container */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src={currentImage}
          alt={"titlu"}
          className="w-full h-full object-cover"
        />
        {requestStatus && (
          <div
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 backdrop-blur ${statusColors[requestStatus]}`}
          >
            {requestStatus}
          </div>
        )}
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

      {/* Property information and actions container */}
      <div className="w-1/2 flex h-full flex-col justify-between p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {[
                property.location.neighborhood,
                property.location.city,
                property.location.country,
              ].join(", ")}
            </h2>
            <span className="text-xs text-slate-400 capitalize">
              {property.type}
            </span>
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

        {/* Bed / bath / size quick stats */}
        <div className="flex items-center gap-4 text-xs text-slate-200">
          <span className="inline-flex items-center gap-1">
            <BedDouble size={14} />
            {property.bedrooms} {t("properties.bedrooms")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={14} />
            {property.bathrooms} {t("properties.bathrooms")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Home size={14} />
            {property.size} {t("properties.size.unit")}
          </span>
        </div>

        {/* Location + contact tags */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <MapPin size={12} /> {property.location.address}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Tag size={12} /> {property.location.zipCode}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Phone size={12} /> {sellerPhone || t("common.na")}
          </span>
        </div>

        {/* Amenities */}
        {property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
            {property.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-primary-500/10 px-2.5 py-0.5 capitalize ring-1 ring-primary-400/20"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 ring-1 ring-white/10">
                +{property.amenities.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="text-xs text-slate-300">
          {t("properties.listedBy")}{" "}
          {sellerName || t("properties.listedBy.agent")}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">
            {property.type}
          </span>
          <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white shadow">
            {priceLabel}
          </span>
        </div>

        {isOwner && (
          <div className="flex flex-wrap gap-2">
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

        {requestStatus === "pending" && onCancelRequest && (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelRequest();
              }}
              disabled={cancelingRequest}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/50 bg-white/5 px-4 py-2 text-sm font-semibold text-red-50 shadow-lg shadow-black/20 transition hover:-translate-y-[1px] hover:bg-red-500/20 hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <X size={14} />
              {cancelingRequest
                ? t("requests.canceling")
                : t("requests.cancel")}
            </button>
          </div>
        )}
      </div>

      {/* {requestStatus === "canceled" && onCancelRequest && (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancelRequest();
            }}
            disabled={cancelingRequest}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/50 bg-white/5 px-4 py-2 text-sm font-semibold text-red-50 shadow-lg shadow-black/20 transition hover:-translate-y-[1px] hover:bg-red-500/20 hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <X size={14} />
            {cancelingRequest
              ? t("requests.canceling")
              : t("requests.cancel")}
          </button>
        </div>
      )} */}

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
