import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import baseURL from "../../config/baseUrl";
import TourRequestListItem from "./TourRequestListItem";
import AudienceRequestDetailPanel from "./AudienceRequestDetailPanel";
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            My audience
          </p>
          <h2 className="text-2xl font-semibold text-white">
            {t("audience.title")}
          </h2>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          {t("audience.loading")}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          {t("audience.empty")}
        </div>
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

          <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
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
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
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
