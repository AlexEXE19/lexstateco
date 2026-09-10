import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import { useTourRequest } from "./useTourRequest";
import userReducer from "../../../state/user/userSlice";
import feedbackReducer from "../../../state/ui/feedback/feedbackSlice";
import { Property } from "../../../schemas/property/Property";
import { User } from "../../../schemas/user/User";
import { TourRequestWithProperty } from "../../../schemas/tourRequest/TourRequest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const property: Property = {
  id: "1",
  agentId: 9,
  price: 250000,
  imageRefs: [],
  location: {
    country: "USA",
    city: "Springfield",
    neighborhood: "Downtown",
    address: "12 Main St",
    zipCode: "62701",
  },
  description: "A bright open-plan loft.",
  size: "850",
  status: "available",
  type: "apartment",
  bedrooms: 2,
  bathrooms: 1,
  amenities: [],
};

const buyer: User = {
  id: "3",
  firstName: "Jamie",
  lastName: "Buyer",
  email: "buyer@example.com",
  password: "",
  phone: "555-0000",
};

const baseRequest: TourRequestWithProperty = {
  id: "req-1",
  propertyId: property.id,
  agentId: property.agentId,
  requesterId: 3,
  requestedAt: new Date(),
  status: "pending",
  Property: property,
};

const renderWithStore = (selectedProperty: Property | null, user: User) => {
  const store = configureStore({
    reducer: { user: userReducer, feedback: feedbackReducer },
    preloadedState: {
      user,
    },
  });

  return renderHook(() => useTourRequest(selectedProperty, user), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe("useTourRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: {} });
    mockedAxios.post.mockResolvedValue({ data: { tourRequest: {} } });
    mockedAxios.delete.mockResolvedValue({ data: {} });
  });

  it("loads an existing pending request and exposes it as active", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: baseRequest,
    });

    const { result } = renderWithStore(property, buyer);

    await waitFor(() => expect(result.current.tourRequest).not.toBeNull());
    expect(result.current.isPending).toBe(true);
    expect(result.current.isAccepted).toBe(false);
    expect(result.current.hasActiveRequest).toBe(true);
  });

  it("treats a 404 as no active request", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 404,
      data: { message: "No tour request found" },
    });

    const { result } = renderWithStore(property, buyer);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    expect(result.current.tourRequest).toBeNull();
    expect(result.current.hasActiveRequest).toBe(false);
  });

  it("purges a stale canceled request instead of surfacing it", async () => {
    const canceled = { ...baseRequest, id: "req-stale", status: "canceled" as const };
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: canceled });

    const { result } = renderWithStore(property, buyer);

    await waitFor(() =>
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/tour-requests/req-stale"),
      ),
    );
    expect(result.current.tourRequest).toBeNull();
  });

  it.each(["pending", "accepted"] as const)(
    "cancels (never re-creates) a %s request when clicked again",
    async (status) => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { ...baseRequest, id: "req-active", status },
      });

      const { result } = renderWithStore(property, buyer);
      await waitFor(() => expect(result.current.tourRequest).not.toBeNull());

      await act(async () => {
        await result.current.handleRequestTour();
      });

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/tour-requests/req-active"),
      );
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(result.current.tourRequest).toBeNull();
      expect(result.current.hasActiveRequest).toBe(false);
    },
  );

  it("creates a new pending request when none exists", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 404,
      data: { message: "No tour request found" },
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: { tourRequest: { ...baseRequest, id: "req-new" } },
    });

    const { result } = renderWithStore(property, buyer);
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());

    await act(async () => {
      await result.current.handleRequestTour();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/tour-requests"),
      expect.objectContaining({
        propertyId: property.id,
        sellerId: property.agentId,
        requesterId: 3,
        status: "pending",
      }),
    );
    expect(result.current.tourRequest?.id).toBe("req-new");
  });

  it("redirects to login instead of calling the API when signed out", async () => {
    const guest: User = { ...buyer, id: "-1" };
    const { result } = renderWithStore(property, guest);

    await act(async () => {
      await result.current.handleRequestTour();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });
});
