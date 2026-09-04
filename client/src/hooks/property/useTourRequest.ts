import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../../config/baseUrl";
import { useFeedbackPrompt } from "../useFeedbackPrompt";
import { TourRequest } from "../../schemas/TourRequest";
import { Property } from "../../schemas/Property";
import { User } from "../../schemas/User";

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
  const [tourRequest, setTourRequest] = useState<TourRequest | null>(null);
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
        const res = await axios.get<TourRequest>(
          `${baseURL}/tour-requests/requester/${currentUser.id}/property/${selectedProperty.id}`,
          {
            validateStatus: (status) => status === 200 || status === 404,
          },
        );
        setTourRequest(res.data);
      } catch (err: any) {
        console.error(err);
        setTourRequest(null);
      }
    };

    fetchExisting();
  }, [selectedProperty, currentUser]);

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
          { status: "canceled" },
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
  const isCanceled = currentStatus === "canceled";

  return {
    tourRequest,
    requestDate,
    setRequestDate,
    requestTime,
    setRequestTime,
    requestStatus,
    handleRequestTour,
    isPending,
    isCanceled,
  };
};
