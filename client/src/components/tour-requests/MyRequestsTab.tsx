import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { openPropertyModal } from "../../state/propertyModal/propertyModalSlice";
import baseURL from "../../config/baseUrl";
import PropertyCard from "../property/PropertyCard";
import { useTourRequestList } from "../../hooks/tour-requests/useTourRequestList";
import { useTranslation } from "../../utils/i18n";

const MyRequestsTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { requests, loading, updatingId, updateRequestStatus } =
    useTourRequestList(
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {requests
            .filter((request) => request.Property)
            .map((request) => (
              <PropertyCard
                key={request.id}
                property={request.Property as NonNullable<
                  typeof request.Property
                >}
                saved={false}
                requestStatus={request.status}
                cancelingRequest={updatingId === request.id}
                onCancelRequest={
                  request.status === "pending"
                    ? () => updateRequestStatus(request.id, "canceled")
                    : undefined
                }
                onSelect={(property) => dispatch(openPropertyModal(property))}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MyRequestsTab;
