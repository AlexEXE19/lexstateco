import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../../../config/baseUrl";
import { useFeedbackPrompt } from "../../../hooks/useFeedbackPrompt";
import { TourRequestWithProperty } from "../../../schemas/tourRequest/TourRequest";
import { Property } from "../../../schemas/property/Property";
import { User } from "../../../schemas/user/User";

export type RequestStatus = "idle" | "loading" | "success" | "error";

// Owns the full lifecycle of the tour-request booking flow for whichever
// property is currently selected: loading any existing request, submitting
// a new one, and canceling a pending one.
export const useTourRequest = (
  selectedProperty: Property | null,
  currentUser: User,
) => {
  const navigate = useNavigate();
  const { promptForFeedback } = useFeedbackPrompt();
  const [tourRequest, setTourRequest] =
    useState<TourRequestWithProperty | null>(null);
  const [requestDate, setRequestDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [requestTime, setRequestTime] = useState<string>("10:00");
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");

  useEffect(() => {
    setTourRequest(null);
    setRequestStatus("idle");
    setRequestDate(new Date().toISOString().slice(0, 10));
    setRequestTime("10:00");
  }, [selectedProperty?.id]);

  useEffect(() => {
    const fetchExisting = async () => {
      if (!selectedProperty || !currentUser || currentUser.id === "-1") {
        setTourRequest(null);
        return;
      }

      try {
        const res = await axios.get<TourRequestWithProperty>(
          `${baseURL}/tour-requests/requester/${currentUser.id}/property/${selectedProperty.id}`,
          {
            validateStatus: (status) => status === 200 || status === 404,
          },
        );

        if (res.status === 404) {
          setTourRequest(null);
          return;
        }

        const fetched = res.data;
        if (fetched.status === "canceled" || fetched.status === "rejected") {
          // Stale request from a previous cycle (a cancel that didn't clean
          // up, or the agent rejected it) - purge it so the property shows
          // a fresh "Request a tour" state instead of a dead end, and so at
          // most one pending/accepted request per property ever lingers
          // (that's also what keeps MyRequestsTab's grid keys unique).
          try {
            await axios.delete(`${baseURL}/tour-requests/${fetched.id}`);
          } catch (cleanupErr) {
            console.error("Error cleaning up stale tour request:", cleanupErr);
          }
          setTourRequest(null);
          return;
        }

        setTourRequest(fetched);
      } catch (err) {
        console.error(err);
        setTourRequest(null);
      }
    };

    fetchExisting();
  }, [selectedProperty, currentUser]);

  const handleRequestTour = async () => {
    if (!currentUser || currentUser.id === "-1") {
      navigate("/login");
      return;
    }

    if (!selectedProperty) return;

    // An existing request (pending or accepted, the only statuses that
    // persist locally - see the fetch effect above) means this click is a
    // cancellation: delete it outright and clear local state so the button
    // reverts to "Request a tour" immediately.
    if (tourRequest) {
      try {
        setRequestStatus("loading");
        await axios.delete(`${baseURL}/tour-requests/${tourRequest.id}`);
        setTourRequest(null);
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
        sellerId: selectedProperty.agentId,
        requesterId: Number(currentUser.id),
        requestedAt: isoDateTime,
        status: "pending",
      });
      setTourRequest(res.data.tourRequest);
      setRequestStatus("success");
      promptForFeedback();
    } catch (error) {
      console.error("Error creating tour request:", error);
      setRequestStatus("error");
    }
  };

  const currentStatus = tourRequest?.status || "none";
  const isPending = currentStatus === "pending";
  const isAccepted = currentStatus === "accepted";
  const hasActiveRequest = isPending || isAccepted;

  return {
    tourRequest,
    requestDate,
    setRequestDate,
    requestTime,
    setRequestTime,
    requestStatus,
    handleRequestTour,
    isPending,
    isAccepted,
    hasActiveRequest,
  };
};
