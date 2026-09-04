import { Users } from "lucide-react";
import { useSelector } from "react-redux";

import TourRequestListItem from "./TourRequestListItem";
import AudienceRequestDetailPanel from "./AudienceRequestDetailPanel";
import TabHeader from "../common/TabHeader";
import EmptyState from "../common/EmptyState";
import LoadingState from "../common/LoadingState";

import { RootState } from "../../state/store";
import baseURL from "../../config/baseUrl";
import { useTourRequestList } from "../../hooks/tour-requests/useTourRequestList";
import { useTranslation } from "../../utils/i18n";

const MyAudienceTab: React.FC = () => {
  const sellerId = useSelector((state: RootState) => state.user.id);
  const { t } = useTranslation();

  const {
    requests,
    loading,
    selectedRequestId,
    setSelectedRequestId,
    selectedRequest,
    selectedProperty,
    heroImage,
    updatingId,
    updateRequestStatus,
  } = useTourRequestList(
    `${baseURL}/tour-requests/seller/${sellerId}`,
    Boolean(sellerId && sellerId !== "-1"),
  );

  return (
    <div className="space-y-6">
      <TabHeader
        icon={Users}
        eyebrow={t("account.tabs.audience")}
        title={t("audience.title")}
        description={!loading && requests.length > 0 ? t("audience.subtitle") : undefined}
      />

      {loading && <LoadingState label={t("audience.loading")} />}

      {!loading && requests.length === 0 && (
        <EmptyState icon={Users} title={t("audience.empty")} />
      )}

      {!loading && requests.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 overflow-y-auto pr-1 lg:max-h-[70vh]">
            {requests.map((request) => (
              <TourRequestListItem
                key={request.id}
                request={request}
                active={selectedRequestId === request.id}
                onSelect={() => setSelectedRequestId(request.id)}
              />
            ))}
          </div>

          <div className="space-y-4 border border-line bg-background-surface p-6">
            {selectedRequest && selectedProperty ? (
              <AudienceRequestDetailPanel
                request={selectedRequest}
                property={selectedProperty}
                heroImage={heroImage}
                updating={updatingId === selectedRequest.id}
                onAccept={() =>
                  updateRequestStatus(selectedRequest.id, "accepted")
                }
                onReject={() =>
                  updateRequestStatus(selectedRequest.id, "rejected")
                }
              />
            ) : (
              <div className="px-1 py-4 text-sm text-ink-subtle">
                {t("audience.select")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAudienceTab;
