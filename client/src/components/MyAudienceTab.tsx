import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CalendarClock, MapPin, Phone, Mail } from "lucide-react";
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

const MyAudienceTab: React.FC = () => {
  const sellerId = useSelector((state: RootState) => state.user.id);
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchIncoming = async () => {
      try {
        setLoading(true);
        const res = await axios.get<TourRequest[]>(
          `${baseURL}/tour-requests/seller/${sellerId}`,
        );
        setRequests(res.data);
        if (res.data.length > 0) {
          setSelectedRequestId(res.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching incoming tour requests:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId && sellerId !== "-1") {
      fetchIncoming();
    }
  }, [sellerId]);

  const selectedRequest = useMemo(
    () => requests.find((r) => r.id === selectedRequestId) || null,
    [requests, selectedRequestId],
  );

  const selectedProperty: Property | undefined = selectedRequest?.Property;
  const heroImage = selectedProperty?.imageRefs?.[0]
    ? `${baseURL.replace(/\/$/, "")}/${selectedProperty.imageRefs[0]}`
    : "/default_house.jpg";

  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    try {
      setUpdatingId(id);
      const res = await axios.put(`${baseURL}/tour-requests/${id}/status`, {
        status,
      });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? res.data.tourRequest : r)),
      );
    } catch (err) {
      console.error("Error updating request status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

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
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            {selectedProperty && selectedRequest ? (
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
                      statusColors[selectedRequest.status] ||
                      "bg-white/10 text-white"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
                  <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                      <CalendarClock size={14} />
                      {formatDateTime(selectedRequest.requestedAt)}
                    </span>
                    {selectedRequest.requester && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                        <Mail size={14} />
                        {selectedRequest.requester.email}
                      </span>
                    )}
                    {selectedRequest.requester && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                        <Phone size={14} />
                        {selectedRequest.requester.phone}
                      </span>
                    )}
                  </div>
                  {selectedProperty.description}
                </div>

                <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("audience.price")}
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
                      {t("audience.size")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.size} sq ft
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("audience.neighborhood")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.neighborhood}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("audience.zip")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.zipCode}
                    </p>
                  </div>
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

                {selectedRequest.status === "pending" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        updateStatus(selectedRequest.id, "accepted")
                      }
                      disabled={updatingId === selectedRequest.id}
                      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-[1px] hover:bg-emerald-400 disabled:opacity-70"
                    >
                      {updatingId === selectedRequest.id
                        ? t("audience.updating")
                        : t("audience.accept")}
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(selectedRequest.id, "rejected")
                      }
                      disabled={updatingId === selectedRequest.id}
                      className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:-translate-y-[1px] hover:bg-rose-400 disabled:opacity-70"
                    >
                      {updatingId === selectedRequest.id
                        ? t("audience.updating")
                        : t("audience.reject")}
                    </button>
                  </div>
                )}
              </>
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
