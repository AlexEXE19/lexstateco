import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Property, User } from "../../types/types";
import { useTranslation } from "../../utils/i18n";
import { useTourRequest } from "../../hooks/property/useTourRequest";
import { useConversationCompose } from "../../hooks/property/useConversationCompose";
import { useSellerInfo } from "../../hooks/property/useSellerInfo";
import PropertyImageGallery from "./PropertyImageGallery";
import TourRequestPanel from "./TourRequestPanel";
import MessageComposer from "./MessageComposer";
import PropertyStatsGrid from "./PropertyStatsGrid";

interface MapPropertyCloudProps {
  property: Property;
  currentUser: User;
  onClose: () => void;
}

const priceLabel = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    price,
  );

// Floats over the map, visually anchored to the single pin the map shows -
// small by default (just enough to identify the property and act on it),
// expandable for the full gallery/stats/description. The map always
// recenters on the selected property (see Map's Recenter helper), so a
// fixed position here reliably reads as "pointing at the pin" without
// having to track Leaflet's own pixel coordinates.
const MapPropertyCloud: React.FC<MapPropertyCloudProps> = ({
  property,
  currentUser,
  onClose,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { sellerName, sellerPhone } = useSellerInfo(property.sellerId);
  const {
    requestDate,
    setRequestDate,
    requestTime,
    setRequestTime,
    requestStatus,
    handleRequestTour,
    isPending,
    isCanceled,
  } = useTourRequest(property, currentUser);
  const {
    showMessageCompose,
    setShowMessageCompose,
    messageText,
    setMessageText,
    messageStatus,
    handleMessageClick,
    handleSendFirstMessage,
  } = useConversationCompose(property, currentUser);

  const thumbnail = property.imageRefs?.[0]
    ? `${property.imageRefs[0]}`
    : "/default_house.jpg";

  return (
    <div className="pointer-events-none absolute inset-0 z-[1000]">
      {/* Positioned so this box's bottom-center sits exactly on the map's
          center point (where Recenter always flies the marker to), then
          the card grows upward from there and the tail tip sits right on
          that point - precise anchoring instead of an eyeballed offset. */}
      <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-full pb-3">
        <div className="max-h-[42vh] overflow-y-auto rounded-2xl bg-background-surface shadow-2xl ring-1 ring-white/10">
          <div className="flex items-start gap-3 p-3">
            <img
              src={thumbnail}
              alt={property.title}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {property.title}
              </p>
              <p className="truncate text-xs text-slate-300">
                {property.location}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-primary-300">
                {priceLabel(property.price)}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label={t("properties.back")}
              className="shrink-0 rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-wrap items-start gap-3 border-t border-white/10 px-3 py-3">
            <TourRequestPanel
              requestDate={requestDate}
              setRequestDate={setRequestDate}
              requestTime={requestTime}
              setRequestTime={setRequestTime}
              requestStatus={requestStatus}
              isPending={isPending}
              isCanceled={isCanceled}
              onRequestTour={handleRequestTour}
            />
            <div className="w-full border-t border-white/10 pt-3">
              <MessageComposer
                showCompose={showMessageCompose}
                messageText={messageText}
                setMessageText={setMessageText}
                messageStatus={messageStatus}
                onMessageClick={handleMessageClick}
                onSend={handleSendFirstMessage}
                onCancel={() => setShowMessageCompose(false)}
              />
            </div>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-center gap-1 border-t border-white/10 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            {expanded ? (
              <>
                {t("properties.cloud.less")}
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                {t("properties.cloud.more")}
                <ChevronDown size={14} />
              </>
            )}
          </button>

          {expanded && (
            <div className="space-y-4 border-t border-white/10 p-4">
              <PropertyImageGallery property={property} />
              <PropertyStatsGrid
                property={property}
                sellerName={sellerName}
                sellerPhone={sellerPhone}
              />
              <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
                {property.description}
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto h-3 w-3 -translate-y-1 rotate-45 border-b border-r border-white/10 bg-background-surface" />
      </div>
    </div>
  );
};

export default MapPropertyCloud;
