import { ClipboardList } from "lucide-react";
import { useSelector } from "react-redux";

import PropertyGrid from "../../properties/components/PropertyGrid";
import TabHeader from "../../../components/common/TabHeader";
import EmptyState from "../../../components/common/EmptyState";
import LoadingState from "../../../components/common/LoadingState";

import { RootState } from "../../../state/store";
import baseURL from "../../../config/baseUrl";
import { useTourRequestList } from "../hooks/useTourRequestList";
import { useTranslation } from "../../../utils/i18n";
import { useNavigate } from "react-router-dom";

const MyRequestsTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { requests, loading, updatingId, updateRequestStatus } =
    useTourRequestList(
      `${baseURL}/tour-requests/requester/${userId}`,
      Boolean(userId && userId !== "-1"),
    );

  const properties = requests.map((request) => request.Property);

  return (
    <div className="space-y-6">
      <TabHeader
        icon={ClipboardList}
        eyebrow={t("account.tabs.requests")}
        title={t("requests.title")}
        description={
          !loading && requests.length > 0 ? t("requests.subtitle") : undefined
        }
      />

      {loading && <LoadingState label={t("requests.loading")} />}

      {!loading && requests.length === 0 && (
        <EmptyState icon={ClipboardList} title={t("requests.empty")} />
      )}

      {!loading && requests.length > 0 && (
        <PropertyGrid
          properties={properties}
          isSaved={() => false}
          onSelect={(property) => {
            navigate(`/properties/${property.id}`);
          }}
          // properties[] is built from requests[] via a straight map, so the
          // same index always identifies the same request - unlike matching
          // back by property id, this stays correct even when the same
          // property shows up more than once (one row per request).
          getKey={(_property, index) => requests[index].id}
          getRequestProps={(_property, index) => {
            const request = requests[index];
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
