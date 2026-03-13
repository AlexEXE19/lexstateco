import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CalendarClock, MapPin } from "lucide-react";
import { RootState } from "../state/store";
import baseURL from "../config/baseUrl";
import Map from "./Map";
import { Property, TourRequest } from "../types/types";
import { useTranslation } from "../utils/i18n";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-200 ring-amber-200/30",
  accepted: "bg-emerald-500/15 text-emerald-200 ring-emerald-200/30",
  rejected: "bg-rose-500/15 text-rose-200 ring-rose-200/30",
  canceled: "bg-slate-500/20 text-slate-200 ring-slate-200/30",
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? value
    : `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
};

const MyRequestsTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TourRequest[]>(
          `${baseURL}/tour-requests/requester/${userId}`,
        );
        setRequests(response.data);
        if (response.data.length > 0) {
          setSelectedRequestId(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching tour requests:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId && userId !== "-1") {
      fetchRequests();
    }
  }, [userId]);

  const selectedRequest = useMemo(
    () => requests.find((req) => req.id === selectedRequestId) || null,
    [requests, selectedRequestId],
  );

  const selectedProperty: Property | undefined = selectedRequest?.Property;
  const heroImage = selectedProperty?.imageRefs?.[0]
    ? `${baseURL.replace(/\/$/, "")}/${selectedProperty.imageRefs[0]}`
    : "/default_house.jpg";

  const cancelRequest = async (id: number) => {
    try {
      setUpdatingId(id);
      const response = await axios.put(
        `${baseURL}/tour-requests/${id}/status`,
        {
          status: "canceled",
        },
      );

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? response.data.tourRequest : r)),
      );
    } catch (error) {
      console.error("Error canceling tour request:", error);
    } finally {
      setUpdatingId(null);
    }
  };

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
            {requests.map((request) => {
              const property = request.Property;
              const thumb = property?.imageRefs?.[0]
                ? `${baseURL.replace(/\/$/, "")}/${property.imageRefs[0]}`
                : "/default_house.jpg";
              const active = selectedRequestId === request.id;

              return (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequestId(request.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-900/40 p-3 text-left transition hover:-translate-y-[1px] hover:border-sky-300/30 hover:shadow-lg hover:shadow-sky-500/10 ${
                    active ? "ring-2 ring-sky-400" : ""
                  }`}
                >
                  <div className="h-20 w-28 overflow-hidden rounded-xl bg-slate-800">
                    <img
                      src={thumb}
                      alt={property?.title || "Property"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">
                        {property?.title || "Property"}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                          statusColors[request.status] ||
                          "bg-white/10 text-white"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {property?.location || "Location"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(request.requestedAt)}
                    </p>
                    {request.status === "pending" && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelRequest(request.id);
                          }}
                          disabled={updatingId === request.id}
                          className="rounded-lg bg-rose-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-rose-500/30 transition hover:-translate-y-[1px] hover:bg-rose-500 disabled:opacity-70"
                        >
                          {updatingId === request.id
                            ? t("requests.canceling")
                            : t("requests.cancel")}
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            {selectedProperty ? (
              <>
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <img
                    src={heroImage}
                    alt={selectedProperty.title}
                    className="h-64 w-full object-cover"
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {selectedProperty.location}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                      statusColors[selectedRequest?.status || "pending"] ||
                      "bg-white/10 text-white"
                    }`}
                  >
                    {selectedRequest?.status}
                  </span>
                </div>

                <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.price")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(selectedProperty.price)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.size")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.size} sq ft
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.neighborhood")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.neighborhood}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.zip")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.zipCode}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                    <CalendarClock size={14} />
                    <span>
                      {formatDateTime(selectedRequest?.requestedAt || "")}
                    </span>
                  </div>
                  <p className="text-xs uppercase text-slate-400">
                    {t("audience.zip")}
                  </p>
                  {selectedProperty.description}
                </div>

                <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    <MapPin size={14} />
                    <span>{t("audience.map")}</span>
                  </div>
                  <div className="h-64 overflow-hidden rounded-xl bg-slate-900/90 ring-1 ring-white/10">
                    <Map />
                  </div>
                </div>
              </>
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
