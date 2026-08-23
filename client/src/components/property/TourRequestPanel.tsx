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

// Renders as a fragment (no wrapping element) since it shares a flex column
// with MessageComposer inside PropertyDetailPanel.
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
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
        <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {t("properties.label.date")}
          </span>
          <input
            type="date"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
            className="bg-transparent text-white focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {t("properties.label.time")}
          </span>
          <input
            type="time"
            value={requestTime}
            onChange={(e) => setRequestTime(e.target.value)}
            className="bg-transparent text-white focus:outline-none"
          />
        </label>
      </div>

      <button
        onClick={onRequestTour}
        disabled={requestStatus === "loading"}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
          isPending
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            : "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-400/30 hover:-translate-y-[1px] hover:shadow-cyan-400/40"
        } ${requestStatus === "loading" ? "opacity-70" : ""}`}
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
        <p className="text-xs text-rose-300">{t("properties.errorAuth")}</p>
      )}
      {requestStatus === "success" && isPending && (
        <p className="text-xs text-emerald-300">
          {t("properties.requestSaved")}
        </p>
      )}
      {requestStatus === "success" && !isPending && (
        <p className="text-xs text-slate-300">
          {t("properties.requestCanceled")}
        </p>
      )}
      {isCanceled && requestStatus === "idle" && (
        <p className="text-xs text-slate-300">
          {t("properties.lastCanceled")}
        </p>
      )}
    </>
  );
};

export default TourRequestPanel;
