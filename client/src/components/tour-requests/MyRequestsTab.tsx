import { ClipboardList } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import PropertyGrid from "../property/PropertyGrid";
import TabHeader from "../common/TabHeader";
import EmptyState from "../common/EmptyState";
import LoadingState from "../common/LoadingState";

import { RootState } from "../../state/store";
import { openPropertyModal } from "../../state/propertyModal/propertyModalSlice";
import baseURL from "../../config/baseUrl";
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

  const requestsWithProperty = requests.filter((request) => request.Property);

  return (
    <div className="space-y-6">
      <TabHeader
        icon={ClipboardList}
        eyebrow={t("account.tabs.requests")}
        title={t("requests.title")}
        description={
          !loading && requestsWithProperty.length > 0
            ? t("requests.subtitle")
            : undefined
        }
      />

      {loading && <LoadingState label={t("requests.loading")} />}

      {!loading && requestsWithProperty.length === 0 && (
        <EmptyState icon={ClipboardList} title={t("requests.empty")} />
      )}

      {!loading && requestsWithProperty.length > 0 && (
        <PropertyGrid
          properties={requestsWithProperty.map(
            (request) => request.Property!,
          )}
          isSaved={() => false}
          onSelect={(property) => dispatch(openPropertyModal(property))}
          getRequestProps={(property) => {
            const request = requestsWithProperty.find(
              (r) => r.Property!.id === property.id,
            )!;
            return {
              requestStatus: request.status,
              cancelingRequest: updatingId === request.id,
              onCancelRequest:
                request.status === "pending"
                  ? () => updateRequestStatus(request.id, "canceled")
                  : undefined,
            };
          }}
        />
      )}
    </div>
  );
};

export default MyRequestsTab;
