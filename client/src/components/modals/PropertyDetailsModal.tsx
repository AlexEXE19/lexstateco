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
import Map from "../common/Map";

const statusDotColor: Record<string, string> = {
  available: "bg-emerald-400",
  pending: "bg-amber-400",
  sold: "bg-slate-500",
};

const PropertyDetailsModal: React.FC = () => {
  const propertyModalState = useSelector(
    (state: RootState) => state.propertyModal,
  );

  const property = propertyModalState.property;
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { sellerName, sellerPhone } = useSellerInfo(property?.agentId ?? -1);
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

  const isOwner = String(property.agentId) === String(currentUser.id);
  const close = () => dispatch(closePropertyModal());

  const priceLabel = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  const modalContent = (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background-surface shadow-2xl ring-1 ring-white/10">
        <button
          onClick={close}
          aria-label={t("properties.back")}
          className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-white/90 transition hover:bg-black/40"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto">
          <PropertyImageGallery property={property} />

          <div className="px-8 py-6">
            {/* Title + price */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-sm text-slate-400">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusDotColor[property.status] ?? "bg-slate-500"}`}
                  />
                  <span>{property.status}</span>
                  <span className="text-slate-600">·</span>
                  <span>{property.type}</span>
                </div>
                <h2 className="font-serif text-3xl leading-snug text-white">
                  {[property.location.address, property.location.neighborhood]
                    .filter(Boolean)
                    .join(", ")}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {[property.location.city, property.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div className="whitespace-nowrap font-serif text-3xl text-white">
                {priceLabel}
              </div>
            </div>

            {/* Stats — spec-sheet style, hairline-separated */}
            <div className="mt-6 flex divide-x divide-white/10 border-y border-white/10">
              <div className="flex-1 py-3 pr-4">
                <div className="text-xl font-semibold text-white">
                  {property.bedrooms}
                </div>
                <div className="text-sm text-slate-400">
                  {t("properties.bedrooms")}
                </div>
              </div>
              <div className="flex-1 py-3 px-4">
                <div className="text-xl font-semibold text-white">
                  {property.bathrooms}
                </div>
                <div className="text-sm text-slate-400">
                  {t("properties.bathrooms")}
                </div>
              </div>
              <div className="flex-1 py-3 pl-4">
                <div className="text-xl font-semibold text-white">
                  {property.size}
                </div>
                <div className="text-sm text-slate-400">
                  {t("properties.size.unit")}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 max-w-[70ch] text-[15px] leading-relaxed text-slate-300">
              {property.description}
            </p>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-3 text-sm font-medium text-slate-300">
                  {t("properties.amenities")}
                </p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2 text-sm capitalize text-slate-300"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tour / message — the one section allowed visual weight */}
            {!isOwner && (
              <div className="mt-6 rounded-xl bg-primary-500/10 p-5 ring-1 ring-primary-400/20">
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
                <div className="mt-3 border-t border-white/10 pt-3">
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
            )}

            <div className="mt-6 border-t border-white/10 pt-5">
              <PropertyStatsGrid
                property={property}
                sellerName={sellerName}
                sellerPhone={sellerPhone}
              />
            </div>
            <div className="bg-white w-full max-w-3xl h-[500px] rounded-lg overflow-hidden relative">
              <Map
                coords={{ lat: 43.2, lng: 32.2 }}
                label="Harta misto"
                onClose={() => {}}
                setAddress={() => {}}
              ></Map>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PropertyDetailsModal;
