import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import PropertyCardSkeleton from "./PropertyCardSkeleton";
import DeletePropertyModal from "./DeletePropertyModal";
import EditPropertyModal from "./EditPropertyModal";

import { usePropertyCardData } from "../../hooks/property/usePropertyCardData";
import { statusColors } from "../../utils/tourRequestStatus";
import { useTranslation } from "../../utils/i18n";
import { Property } from "../../schemas/Property";
import { TourRequest } from "../../schemas/TourRequest";

// A listing card: photo first, then price, then the three numbers buyers
// actually scan for, then the address. Everything else (phone, amenities,
// agent name) belongs on the detail page, not repeated on every tile.
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

  if (loading) return <PropertyCardSkeleton />;
  if (deleted) return null;

  const { neighborhood, city, address } = property.location;

  return (
    <article
      onClick={() => onSelect?.(property)}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-background-surface transition-shadow duration-200 hover:shadow-lift ${
        selected ? "border-primary-500" : "border-line"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background-muted">
        <img
          src={currentImage}
          alt={`${neighborhood}, ${city}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {requestStatus && (
          <span
            className={`absolute left-3 top-3 rounded border px-2 py-1 text-[11px] font-medium capitalize ${statusColors[requestStatus]}`}
          >
            {requestStatus}
          </span>
        )}

        {!isOwner && (
          <button
            onClick={handleSaveClick}
            aria-label={
              isSaved
                ? t("properties.actions.unsave")
                : t("properties.actions.save")
            }
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-background-surface/90 text-ink transition-colors hover:bg-background-surface"
          >
            <Bookmark
              size={15}
              className={isSaved ? "fill-ink text-ink" : "text-ink-muted"}
            />
          </button>
        )}

        {imageCount > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                nextImage(-1);
              }}
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-background-surface/85 text-ink opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                nextImage(1);
              }}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-background-surface/85 text-ink opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
              {property.imageRefs?.slice(0, 8).map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Photo ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeImage
                      ? "w-4 bg-background-surface"
                      : "w-1.5 bg-background-surface/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-xl leading-none text-ink">
            {priceLabel}
          </p>
          <span className="text-[11px] uppercase tracking-label text-ink-subtle">
            {property.type}
          </span>
        </div>

        <p className="mt-2.5 text-sm text-ink-muted">
          <span className="font-medium text-ink">{property.bedrooms}</span>{" "}
          {t("properties.bedrooms")}
          <span className="px-1.5 text-line-strong">·</span>
          <span className="font-medium text-ink">{property.bathrooms}</span>{" "}
          {t("properties.bathrooms")}
          <span className="px-1.5 text-line-strong">·</span>
          <span className="font-medium text-ink">{property.size}</span>{" "}
          {t("properties.size.unit")}
        </p>

        <p className="mt-1 truncate text-sm text-ink-subtle">
          {[address, neighborhood, city].filter(Boolean).join(", ")}
        </p>

        {isOwner && (
          <div className="mt-4 flex gap-2 border-t border-line pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalType("edit");
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-background-elevated hover:text-ink"
            >
              <Pencil size={13} />
              {t("properties.actions.edit")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalType("delete");
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 size={13} />
              {t("properties.actions.delete")}
            </button>
          </div>
        )}

        {requestStatus === "pending" && onCancelRequest && (
          <div className="mt-4 border-t border-line pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelRequest();
              }}
              disabled={cancelingRequest}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
            >
              <X size={13} />
              {cancelingRequest ? t("requests.canceling") : t("requests.cancel")}
            </button>
          </div>
        )}
      </div>

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
    </article>
  );
};

export default PropertyCard;
