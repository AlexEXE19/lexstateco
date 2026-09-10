import { useTranslation } from "../../../utils/i18n";
import { useTourRequest } from "../hooks/useTourRequest";
import { useNavigate } from "react-router-dom";
import { Property } from "../../../schemas/property/Property";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";

interface TourRequestPanelProps {
  property: Property;
}

// Renders as a fragment (no wrapping element) so it can share a column
// with MessageComposer in the detail page sidebar.
const TourRequestPanel: React.FC<TourRequestPanelProps> = ({ property }) => {
  const { t } = useTranslation();

  const currentUser = useSelector((state: RootState) => state.user);

  const {
    requestDate,
    setRequestDate,
    requestTime,
    setRequestTime,
    requestStatus,
    handleRequestTour,
    isPending,
    isAccepted,
    hasActiveRequest,
  } = useTourRequest(property, currentUser);

  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="tour-date">
            {t("properties.label.date")}
          </label>
          <input
            id="tour-date"
            type="date"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
            className="field"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="tour-time">
            {t("properties.label.time")}
          </label>
          <input
            id="tour-time"
            type="time"
            value={requestTime}
            onChange={(e) => setRequestTime(e.target.value)}
            className="field"
          />
        </div>
      </div>

      <button
        onClick={handleRequestTour}
        disabled={requestStatus === "loading"}
        className={`${
          hasActiveRequest ? "btn-secondary" : "btn-primary"
        } w-full ${requestStatus === "loading" ? "opacity-70" : ""}`}
      >
        {requestStatus === "loading"
          ? hasActiveRequest
            ? t("properties.canceling")
            : t("properties.sending")
          : hasActiveRequest
            ? t("requests.cancel")
            : t("properties.request")}
      </button>
      {requestStatus === "error" && (
        <p className="text-xs text-rose-600">{t("properties.errorAuth")}</p>
      )}
      {requestStatus === "success" && isPending && (
        <button
          onClick={() => {
            navigate("/profile/manage?activeTab=requests");
          }}
        >
          <p className="text-xs text-primary-700 hover:underline">
            {t("properties.requestSaved")}
          </p>
        </button>
      )}
      {requestStatus === "success" && !hasActiveRequest && (
        <p className="text-xs text-ink-subtle">
          {t("properties.requestCanceled")}
        </p>
      )}
      {isAccepted && requestStatus === "idle" && (
        <p className="text-xs text-ink-subtle">
          {t("properties.tourAccepted")}
        </p>
      )}
    </>
  );
};

export default TourRequestPanel;
