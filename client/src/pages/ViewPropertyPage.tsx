import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MessageComposer from "../components/property/MessageComposer";
import PropertyStatsGrid from "../components/property/PropertyStatsGrid";
import Map from "../components/common/Map";
import { useTranslation } from "../utils/i18n";
import { useSellerInfo } from "../hooks/property/useSellerInfo";
import { RootState } from "../state/store";
import { useTourRequest } from "../hooks/property/useTourRequest";
import { useConversationCompose } from "../hooks/property/useConversationCompose";
import PropertyImageGallery from "../components/property/PropertyImageGallery";
import TourRequestPanel from "../components/property/TourRequestPanel";

const statusDotColor: Record<string, string> = {
  available: "bg-emerald-400",
  pending: "bg-amber-400",
  sold: "bg-slate-500",
};

const ViewPropertyPage: React.FC = () => {
  const navigate = useNavigate();

  const propertyModalState = useSelector(
    (state: RootState) => state.propertyModal,
  );

  const property = propertyModalState.property;

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

  const priceLabel = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <button
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft size={16} />
          {t("properties.back")}
        </button>

        <div className="overflow-hidden rounded-2xl bg-background-surface ring-1 ring-white/10">
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
                <h1 className="font-serif text-3xl leading-snug text-white">
                  {[property.location.address, property.location.neighborhood]
                    .filter(Boolean)
                    .join(", ")}
                </h1>
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

            {/* Tour / message */}
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

            <div className="relative mt-6 h-[500px] w-full overflow-hidden rounded-lg bg-white">
              <Map
                coords={{ lat: 43.2, lng: 32.2 }}
                label="Harta misto"
                onClose={() => {}}
                setAddress={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyPage;
