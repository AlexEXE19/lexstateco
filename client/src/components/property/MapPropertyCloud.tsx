import { X } from "lucide-react";
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

// Floats over the map, visually anchored to the single pin the map shows -
// a centered card with a small downward-pointing tail. The map always
// recenters on the selected property (see Map's Recenter helper), so a
// fixed position here reliably reads as "pointing at the pin" without
// having to track Leaflet's own pixel coordinates.
const MapPropertyCloud: React.FC<MapPropertyCloudProps> = ({
  property,
  currentUser,
  onClose,
}) => {
  const { t } = useTranslation();
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

  return (
    <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="pointer-events-auto relative w-full max-w-md">
        <div className="max-h-[70vh] space-y-4 overflow-y-auto rounded-3xl bg-background-surface p-5 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {t("properties.details")}
            </p>
            <button
              onClick={onClose}
              aria-label={t("properties.back")}
              className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <PropertyImageGallery property={property} />

          <div>
            <h3 className="text-xl font-semibold text-white">
              {property.title}
            </h3>
            <p className="text-sm text-slate-200">{property.location}</p>
          </div>

          <div className="flex flex-wrap items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
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

          <PropertyStatsGrid
            property={property}
            sellerName={sellerName}
            sellerPhone={sellerPhone}
          />

          <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
            {property.description}
          </div>
        </div>

        <div className="mx-auto -mt-2 h-4 w-4 rotate-45 bg-background-surface ring-1 ring-white/10" />
      </div>
    </div>
  );
};

export default MapPropertyCloud;
