import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { TourRequest } from "../../schemas/TourRequest";
import { Property } from "../../schemas/Property";

// Shared by MyRequestsTab (requester's own tour requests) and MyAudienceTab
// (incoming tour requests for a seller): both fetch a list keyed by user id,
// let the user pick one to inspect, and PUT a new status on it.
export const useTourRequestList = (fetchUrl: string, enabled: boolean) => {
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TourRequest[]>(fetchUrl);
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
    fetchRequests();
  }, [fetchUrl, enabled]);

  const selectedRequest = useMemo(
    () => requests.find((req) => req.id === selectedRequestId) || null,
    [requests, selectedRequestId],
  );

  // TO DO UPDATE TO NEW SCHEMA

  const selectedProperty: Property | undefined = selectedRequest?.Property;
  const heroImage = selectedProperty?.imageRefs?.[0]
    ? `${baseURL.replace(/\/$/, "")}/${selectedProperty.imageRefs[0]}`
    : "/default_house.jpg";

  const updateRequestStatus = async (
    id: number,
    status: "accepted" | "rejected" | "canceled",
  ) => {
    try {
      setUpdatingId(id);
      const response = await axios.put(
        `${baseURL}/tour-requests/${id}/status`,
        { status },
      );
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? response.data.tourRequest : r)),
      );
    } catch (error) {
      console.error("Error updating tour request status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    requests,
    loading,
    selectedRequestId,
    setSelectedRequestId,
    selectedRequest,
    selectedProperty,
    heroImage,
    updatingId,
    updateRequestStatus,
  };
};
