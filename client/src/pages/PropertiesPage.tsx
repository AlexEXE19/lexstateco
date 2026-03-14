import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  SlidersHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Map from "../components/Map";
import PropertyCard from "../components/PropertyCard";
import { RootState } from "../state/store";
import { useProperties } from "../hooks/useProperties";
import { Filter, Property, TourRequest } from "../types/types";
import { useTranslation } from "../utils/i18n";
import baseURL from "../config/baseUrl";
import { Navigate, useNavigate } from "react-router-dom";
import { setTab } from "../state/tab/tabSlice";

const PropertiesPage: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [detailImageIndex, setDetailImageIndex] = useState<number>(0);
  const [tourRequest, setTourRequest] = useState<TourRequest | null>(null);
  const [requestDate, setRequestDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [requestTime, setRequestTime] = useState<string>("10:00");
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [showMessageCompose, setShowMessageCompose] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageStatus, setMessageStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");

  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { filteredProperties, savedIds, applyFilters, loading } =
    useProperties(currentUser);

  const filters: Filter = useMemo(
    () => ({ location, minPrice, maxPrice, neighborhood }),
    [location, minPrice, maxPrice, neighborhood],
  );

  const onFilterSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    applyFilters(filters);
    setSelectedProperty(null);
  };

  useEffect(() => {
    setDetailImageIndex(0);
    setTourRequest(null);
    setRequestStatus("idle");
    setRequestDate(new Date().toISOString().slice(0, 10));
    setRequestTime("10:00");
    setShowMessageCompose(false);
    setMessageText("");
    setMessageStatus("idle");
  }, [selectedProperty?.id]);

  useEffect(() => {
    const fetchExisting = async () => {
      if (!selectedProperty || !currentUser || currentUser.id === "-1") {
        setTourRequest(null);
        return;
      }

      try {
        const res = await axios.get<TourRequest>(
          `${baseURL}/tour-requests/requester/${currentUser.id}/property/${selectedProperty.id}`,
        );
        setTourRequest(res.data);
      } catch (err: any) {
        setTourRequest(null);
      }
    };

    fetchExisting();
  }, [selectedProperty, currentUser]);

  const navigate = useNavigate();

  const handleRequestTour = async () => {
    if (!selectedProperty) return;
    if (!currentUser || currentUser.id === "-1") {
      navigate("/login");
      return;
    }

    if (tourRequest && tourRequest.status === "pending") {
      try {
        setRequestStatus("loading");
        const res = await axios.put(
          `${baseURL}/tour-requests/${tourRequest.id}/status`,
          {
            status: "canceled",
          },
        );
        setTourRequest(res.data.tourRequest);
        setRequestStatus("success");
      } catch (error) {
        console.error("Error canceling tour request:", error);
        setRequestStatus("error");
      }
      return;
    }

    const isoDateTime = new Date(
      `${requestDate}T${requestTime}:00`,
    ).toISOString();

    try {
      setRequestStatus("loading");
      const res = await axios.post(`${baseURL}/tour-requests`, {
        propertyId: selectedProperty.id,
        sellerId: selectedProperty.sellerId,
        requesterId: Number(currentUser.id),
        requestedAt: isoDateTime,
        status: "pending",
      });
      setTourRequest(res.data.tourRequest);
      setRequestStatus("success");
    } catch (error) {
      console.error("Error creating tour request:", error);
      setRequestStatus("error");
    }
  };

  const goToConversation = (conversationId: number | null) => {
    dispatch(setTab({ type: "messages", conversationId }));
    navigate("/account");
  };

  const handleMessageClick = async () => {
    if (!selectedProperty) return;
    if (!currentUser || currentUser.id === "-1") {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `${baseURL}/conversations/property/${selectedProperty.id}/user/${currentUser.id}`,
      );
      goToConversation(res.data.id);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setShowMessageCompose(true);
      } else {
        console.error("Error checking conversation", err);
      }
    }
  };

  const handleSendFirstMessage = async () => {
    if (!selectedProperty) return;
    if (!messageText.trim()) return;
    setMessageStatus("loading");
    try {
      const res = await axios.post(`${baseURL}/conversations/start`, {
        propertyId: selectedProperty.id,
        senderId: Number(currentUser.id),
        content: messageText.trim(),
      });
      setMessageStatus("idle");
      setShowMessageCompose(false);
      setMessageText("");
      goToConversation(res.data.conversation.id);
    } catch (err) {
      console.error("Error starting conversation", err);
      setMessageStatus("error");
    }
  };

  const currentStatus = tourRequest?.status || "none";
  const isPending = currentStatus === "pending";
  const isCanceled = currentStatus === "canceled";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/80 px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 ring-1 ring-white/15 backdrop-blur">
              <SlidersHorizontal size={14} />
              <span>{t("properties.filter.tag")}</span>
            </div>
            <h1 className="text-3xl font-semibold md:text-4xl">
              {t("properties.filter.heading")}
            </h1>
            <p className="max-w-2xl text-slate-200">
              {t("properties.filter.sub")}
            </p>
          </div>

          <form
            onSubmit={onFilterSubmit}
            className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:grid-cols-2 lg:grid-cols-5"
          >
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("properties.filter.min")}
              <input
                type="number"
                placeholder={t("properties.filter.placeholder.min")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("properties.filter.max")}
              <input
                type="number"
                placeholder={t("properties.filter.placeholder.max")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("properties.filter.location")}
              <input
                type="text"
                placeholder={t("properties.filter.placeholder.location")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("properties.filter.neighborhood")}
              <input
                type="text"
                placeholder={t("properties.filter.placeholder.neighborhood")}
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
              >
                <Search size={16} />
                {t("properties.filter.apply")}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {t("properties.resultsLabel")}
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {filteredProperties.length} {t("properties.results")}
              </h2>
            </div>
          </div>

          {selectedProperty ? (
            <div className="grid gap-6 lg:h-[75vh] lg:grid-cols-2 lg:overflow-hidden">
              <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-rows-[1fr_1fr]">
                <div className="rounded-3xl bg-white/5 p-6 text-slate-200 ring-1 ring-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {t("properties.map")}
                  </p>
                  <div className="mt-4 h-[240px] w-full rounded-2xl bg-slate-900/80 ring-1 ring-white/10 lg:h-full">
                    <div
                      id="map"
                      className="flex h-full items-center justify-center text-slate-400"
                    >
                      <Map
                        location={selectedProperty?.location}
                        label={`${selectedProperty?.title || "Property"} • ${selectedProperty?.location || ""}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
                  <div className="text-sm text-slate-300">
                    {t("properties.browse")}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        saved={savedIds.includes(property.id)}
                        selected={selectedProperty?.id === property.id}
                        onSelect={setSelectedProperty}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 lg:h-full lg:overflow-y-auto lg:pr-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {t("properties.details")}
                  </p>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="text-sm font-semibold text-slate-200 underline-offset-4 hover:underline"
                  >
                    {t("properties.back")}
                  </button>
                </div>
                <div className="overflow-hidden rounded-2xl bg-slate-900/80 ring-1 ring-white/10">
                  {selectedProperty && (
                    <div className="relative h-64 w-full">
                      {selectedProperty.imageRefs?.length ? (
                        <img
                          src={`${baseURL.replace(/\/$/, "")}/${selectedProperty.imageRefs[detailImageIndex % selectedProperty.imageRefs.length]}`}
                          alt={selectedProperty.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src="/default_house.jpg"
                          alt={selectedProperty.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                      {selectedProperty.imageRefs?.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setDetailImageIndex(
                                (i) =>
                                  (i - 1 + selectedProperty.imageRefs.length) %
                                  selectedProperty.imageRefs.length,
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            onClick={() =>
                              setDetailImageIndex(
                                (i) =>
                                  (i + 1) % selectedProperty.imageRefs.length,
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                          >
                            <ChevronRight size={18} />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            {selectedProperty.imageRefs
                              .slice(0, 8)
                              .map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setDetailImageIndex(idx)}
                                  className={`h-2 w-2 rounded-full ${
                                    idx === detailImageIndex
                                      ? "bg-white"
                                      : "bg-white/50"
                                  }`}
                                />
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-sm text-slate-200">
                      {selectedProperty.location}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
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
                      onClick={handleRequestTour}
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
                    <button
                      onClick={handleMessageClick}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/20"
                    >
                      {t("account.messages.messageOwner")}
                    </button>
                    {requestStatus === "error" && (
                      <p className="text-xs text-rose-300">
                        {t("properties.errorAuth")}
                      </p>
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
                    {showMessageCompose && (
                      <div className="mt-3 space-y-2 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {t("account.messages.firstMessage")}
                        </p>
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={3}
                          className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder={t("account.messages.inputPlaceholder")}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSendFirstMessage}
                            disabled={messageStatus === "loading"}
                            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400 disabled:opacity-70"
                          >
                            {messageStatus === "loading"
                              ? t("properties.sending")
                              : (t("account.messages.send") ?? "Send")}
                          </button>
                          <button
                            onClick={() => setShowMessageCompose(false)}
                            className="text-sm text-slate-200 underline"
                          >
                            {t("common.cancel") ?? "Cancel"}
                          </button>
                        </div>
                        {messageStatus === "error" && (
                          <p className="text-xs text-rose-300">
                            {t("properties.errorAuth")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm text-slate-200 sm:grid-cols-2">
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
                    <p className="text-xs text-slate-400">
                      {t("properties.price.includesFees")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.size")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.size} {t("properties.size.unit")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t("properties.size.hint")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.neighborhood")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.neighborhood}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t("properties.neighborhood.hint")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.zip")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {selectedProperty.zipCode}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t("properties.zip.hint")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:col-span-2">
                    <p className="text-xs uppercase text-slate-400">
                      {t("properties.label.seller")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      ID #{selectedProperty.sellerId}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t("properties.seller.hint")}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 ring-1 ring-white/10">
                  {selectedProperty.description}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    saved={savedIds.includes(property.id)}
                    onSelect={setSelectedProperty}
                  />
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-200">
                  {t("properties.empty")}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;
