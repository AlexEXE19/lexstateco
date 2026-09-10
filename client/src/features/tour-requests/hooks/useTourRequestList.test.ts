import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import axios from "axios";
import { useTourRequestList } from "./useTourRequestList";
import { Property } from "../../../schemas/property/Property";
import { TourRequestWithProperty } from "../../../schemas/tourRequest/TourRequest";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const property = (overrides: Partial<Property> = {}): Property => ({
  id: "1",
  agentId: 9,
  price: 250000,
  imageRefs: ["properties/1/hero.jpg"],
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
  ...overrides,
});

const request = (
  overrides: Partial<TourRequestWithProperty> = {},
): TourRequestWithProperty => ({
  id: "req-1",
  propertyId: "1",
  agentId: 9,
  requesterId: 3,
  requestedAt: new Date(),
  status: "pending",
  Property: property(),
  ...overrides,
});

describe("useTourRequestList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the list and selects the first request by default", async () => {
    const requests = [request({ id: "req-1" }), request({ id: "req-2" })];
    mockedAxios.get.mockResolvedValueOnce({ data: requests });

    const { result } = renderHook(() =>
      useTourRequestList("http://api/tour-requests/x", true),
    );

    await waitFor(() => expect(result.current.requests).toHaveLength(2));
    expect(result.current.selectedRequestId).toBe("req-1");
    expect(result.current.loading).toBe(false);
  });

  it("does not fetch when disabled", async () => {
    renderHook(() => useTourRequestList("http://api/tour-requests/x", false));

    await new Promise((r) => setTimeout(r, 0));
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("derives selectedProperty and heroImage from the selected request", async () => {
    const requests = [
      request({
        id: "req-1",
        Property: property({ imageRefs: ["properties/1/hero.jpg"] }),
      }),
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: requests });

    const { result } = renderHook(() =>
      useTourRequestList("http://api/tour-requests/x", true),
    );

    await waitFor(() => expect(result.current.requests).toHaveLength(1));
    expect(result.current.selectedProperty?.id).toBe("1");
    expect(result.current.heroImage).toContain("properties/1/hero.jpg");
  });

  it("falls back to the default image when the property has no photos", async () => {
    const requests = [
      request({ id: "req-1", Property: property({ imageRefs: [] }) }),
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: requests });

    const { result } = renderHook(() =>
      useTourRequestList("http://api/tour-requests/x", true),
    );

    await waitFor(() => expect(result.current.requests).toHaveLength(1));
    expect(result.current.heroImage).toBe("/default_house.jpg");
  });

  it("updates only the targeted request's status in place", async () => {
    const requests = [request({ id: "req-1" }), request({ id: "req-2" })];
    mockedAxios.get.mockResolvedValueOnce({ data: requests });
    mockedAxios.put.mockResolvedValueOnce({
      data: { tourRequest: { ...requests[0], status: "accepted" } },
    });

    const { result } = renderHook(() =>
      useTourRequestList("http://api/tour-requests/x", true),
    );
    await waitFor(() => expect(result.current.requests).toHaveLength(2));

    await act(async () => {
      await result.current.updateRequestStatus("req-1", "accepted");
    });

    expect(result.current.requests.find((r) => r.id === "req-1")?.status).toBe(
      "accepted",
    );
    expect(result.current.requests.find((r) => r.id === "req-2")?.status).toBe(
      "pending",
    );
    expect(result.current.updatingId).toBeNull();
  });
});
