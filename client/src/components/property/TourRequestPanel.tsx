import { useTranslation } from "../../utils/i18n";
import { RequestStatus } from "../../hooks/property/useTourRequest";

interface TourRequestPanelProps {
  requestDate: string;
  setRequestDate: (value: string) => void;
  requestTime: string;
  setRequestTime: (value: string) => void;
  requestStatus: RequestStatus;
  isPending: boolean;
  isCanceled: boolean;
  onRequestTour: () => void;
}

// Renders as a fragment (no wrapping element) so it can share a column
// with MessageComposer in the detail page sidebar.
const TourRequestPanel: React.FC<TourRequestPanelProps> = ({
  requestDate,
  setRequestDate,
  requestTime,
  setRequestTime,
  requestStatus,
  isPending,
  isCanceled,
  onRequestTour,
}) => {
  const { t } = useTranslation();

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
        onClick={onRequestTour}
        disabled={requestStatus === "loading"}
        className={`${
          isPending ? "btn-secondary" : "btn-primary"
        } w-full ${requestStatus === "loading" ? "opacity-70" : ""}`}
      >
        {requestStatus === "loading"
          ? isPending
            ? t("properties.canceling")
            : t("properties.sending")
          : isPending
            ? t("requests.cancel")
            : t("properties.request")}
      </button>
      {requestStatus === "error" && (
        <p className="text-xs text-rose-600">{t("properties.errorAuth")}</p>
      )}
      {requestStatus === "success" && isPending && (
        <p className="text-xs text-primary-700">
          {t("properties.requestSaved")}
        </p>
      )}
      {requestStatus === "success" && !isPending && (
        <p className="text-xs text-ink-subtle">
          {t("properties.requestCanceled")}
        </p>
      )}
      {isCanceled && requestStatus === "idle" && (
        <p className="text-xs text-ink-subtle">
          {t("properties.lastCanceled")}
        </p>
      )}
    </>
  );
};

export default TourRequestPanel;
