import { Property, User } from "../../types/types";
import { useTranslation } from "../../utils/i18n";
import { useTourRequest } from "../../hooks/property/useTourRequest";
import { useConversationCompose } from "../../hooks/property/useConversationCompose";
import PropertyImageGallery from "./PropertyImageGallery";
import TourRequestPanel from "./TourRequestPanel";
import MessageComposer from "./MessageComposer";
import PropertyStatsGrid from "./PropertyStatsGrid";

interface PropertyDetailPanelProps {
  property: Property;
  currentUser: User;
  onClose: () => void;
}

const PropertyDetailPanel: React.FC<PropertyDetailPanelProps> = ({
  property,
  currentUser,
  onClose,
}) => {
  const { t } = useTranslation();
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
    <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 lg:h-full lg:overflow-y-auto lg:pr-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          {t("properties.details")}
        </p>
        <button
          onClick={onClose}
          className="text-sm font-semibold text-slate-200 underline-offset-4 hover:underline"
        >
          {t("properties.back")}
        </button>
      </div>

      <PropertyImageGallery property={property} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            {property.title}
          </h3>
          <p className="text-sm text-slate-200">{property.location}</p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
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
      </div>

      <PropertyStatsGrid property={property} />

      <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
        {property.description}
      </div>
    </div>
  );
};

export default PropertyDetailPanel;
