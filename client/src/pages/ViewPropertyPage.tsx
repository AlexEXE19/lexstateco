import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PropertyImageGallery from "../components/property/PropertyImageGallery";
import PropertyStatsGrid from "../components/property/PropertyStatsGrid";
import TourRequestPanel from "../components/property/TourRequestPanel";
import MessageComposer from "../components/property/MessageComposer";
import Map, { Coords } from "../components/common/Map";

import { RootState } from "../state/store";
import { useLocationApi } from "../hooks/property/useLocationApi";
import { buildQuery } from "../utils/buildQuery";
import { humanizeEnumValue } from "../utils/humanize";
import { useSellerInfo } from "../hooks/property/useSellerInfo";
import { useTourRequest } from "../hooks/property/useTourRequest";
import { useConversationCompose } from "../hooks/property/useConversationCompose";
import { useTranslation } from "../utils/i18n";

const statusDotColor: Record<string, string> = {
  available: "bg-primary-600",
  pending: "bg-secondary-500",
  sold: "bg-ink-subtle",
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

  // Properties don't store coordinates, so the map pin is geocoded from the
  // address. useLocationApi currently returns null (geocoding is switched
  // off), in which case the map section simply doesn't render rather than
  // pinning somewhere misleading.
  const { getCoordinatesByQuery } = useLocationApi();
  const [mapCoords, setMapCoords] = useState<Coords | null>(null);
  const addressQuery = property
    ? [
        property.location.address,
        property.location.city,
        property.location.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  useEffect(() => {
    let active = true;
    if (!addressQuery) return;

    (async () => {
      const found = await getCoordinatesByQuery(buildQuery({ q: addressQuery }));
      if (active) setMapCoords(found);
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressQuery]);
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

  const facts = [
    { value: property.bedrooms, label: t("properties.bedrooms") },
    { value: property.bathrooms, label: t("properties.bathrooms") },
    { value: property.size, label: t("properties.size.unit") },
  ];

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        <button
          className="btn-quiet -ml-3 mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          {t("properties.back")}
        </button>

        <PropertyImageGallery property={property} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  statusDotColor[property.status] ?? "bg-ink-subtle"
                }`}
              />
              <span className="capitalize">{property.status}</span>
              <span className="text-line-strong">·</span>
              <span className="capitalize">{property.type}</span>
            </div>

            <h1 className="mt-3 font-display text-display-sm text-ink">
              {[property.location.address, property.location.neighborhood]
                .filter(Boolean)
                .join(", ")}
            </h1>
            <p className="mt-2 text-ink-muted">
              {[property.location.city, property.location.country]
                .filter(Boolean)
                .join(", ")}
            </p>

            <div className="mt-8 flex divide-x divide-line border-y border-line">
              {facts.map((fact) => (
                <div key={fact.label} className="flex-1 py-4 pl-5 first:pl-0">
                  <div className="font-display text-2xl leading-none text-ink">
                    {fact.value}
                  </div>
                  <div className="mt-1.5 text-sm text-ink-muted">
                    {fact.label}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-[68ch] leading-relaxed text-ink-muted">
              {property.description}
            </p>

            {property.amenities.length > 0 && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="eyebrow">{t("listing.label.amenities")}</p>
                <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2.5 text-sm text-ink-muted"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-primary-500" />
                      {humanizeEnumValue(amenity)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mapCoords && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="eyebrow mb-5">{t("properties.map")}</p>
                <div className="relative h-[420px] w-full overflow-hidden border border-line">
                  <Map coords={mapCoords} label={addressQuery} readOnly />
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line bg-background-surface p-6">
              <p className="font-display text-3xl leading-none text-ink">
                {priceLabel}
              </p>
              <p className="mt-2 text-xs text-ink-subtle">
                {t("properties.price.includesFees")}
              </p>

              {!isOwner && (
                <div className="mt-6 space-y-4 border-t border-line pt-6">
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
              )}
            </div>

            <div className="mt-6">
              <PropertyStatsGrid
                property={property}
                sellerName={sellerName}
                sellerPhone={sellerPhone}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyPage;
