import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { RootState } from "../../state/store";
import { closePropertyModal } from "../../state/propertyModal/propertyModalSlice";
import { useTranslation } from "../../utils/i18n";
import { useTourRequest } from "../../hooks/property/useTourRequest";
import { useConversationCompose } from "../../hooks/property/useConversationCompose";
import { useSellerInfo } from "../../hooks/property/useSellerInfo";
import PropertyImageGallery from "../property/PropertyImageGallery";
import TourRequestPanel from "../property/TourRequestPanel";
import MessageComposer from "../property/MessageComposer";
import PropertyStatsGrid from "../property/PropertyStatsGrid";

// Global "see everything about this property" modal - the one place this
// content renders, opened from the compact map cloud's "More details" and
// from clicking a property anywhere in My Account, so it looks the same
// regardless of where you came from. A real modal (not anchored to
// anything on screen) so it can't end up clipped behind the navbar the
// way the map-anchored cloud could.
const PropertyDetailsModal: React.FC = () => {
  const dispatch = useDispatch();
  const property = useSelector(
    (state: RootState) => state.propertyModal.property,
  );
  const currentUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { sellerName, sellerPhone } = useSellerInfo(property?.sellerId ?? -1);
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

  if (!property) return null;

  const close = () => dispatch(closePropertyModal());

  const modalContent = (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-background-surface p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            {t("properties.details")}
          </p>
          <button
            onClick={close}
            aria-label={t("properties.back")}
            className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <PropertyImageGallery property={property} />

          <div>
            <h2 className="text-2xl font-semibold text-white">
              {property.title}
            </h2>
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
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PropertyDetailsModal;
