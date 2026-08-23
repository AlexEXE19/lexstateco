import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import baseURL from "../../config/baseUrl";
import TourRequestListItem from "./TourRequestListItem";
import MyRequestDetailPanel from "./MyRequestDetailPanel";
import { useTourRequestList } from "../../hooks/tour-requests/useTourRequestList";
import { useTranslation } from "../../utils/i18n";

const MyRequestsTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
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
    `${baseURL}/tour-requests/requester/${userId}`,
    Boolean(userId && userId !== "-1"),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            My requests
          </p>
          <h2 className="text-2xl font-semibold text-white">
            {t("requests.title")}
          </h2>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          {t("requests.loading")}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          {t("requests.empty")}
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
                actions={
                  request.status === "pending" && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateRequestStatus(request.id, "canceled");
                        }}
                        disabled={updatingId === request.id}
                        className="rounded-lg bg-rose-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-rose-500/30 transition hover:-translate-y-[1px] hover:bg-rose-500 disabled:opacity-70"
                      >
                        {updatingId === request.id
                          ? t("requests.canceling")
                          : t("requests.cancel")}
                      </button>
                    </div>
                  )
                }
              />
            ))}
          </div>

          <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            {selectedRequest && selectedProperty ? (
              <MyRequestDetailPanel
                request={selectedRequest}
                property={selectedProperty}
                heroImage={heroImage}
              />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
                {t("requests.select")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequestsTab;
