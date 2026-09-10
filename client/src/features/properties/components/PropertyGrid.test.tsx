import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import PropertyGrid from "./PropertyGrid";
import userReducer from "../../../state/user/userSlice";
import langReducer from "../../../state/ui/lang/langSlice";
import { Property } from "../../../schemas/property/Property";

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

const renderGrid = (properties: Property[], props: Partial<React.ComponentProps<typeof PropertyGrid>> = {}) => {
  const store = configureStore({
    reducer: { user: userReducer, lang: langReducer },
    preloadedState: {
      user: {
        id: "3",
        firstName: "Jamie",
        lastName: "Buyer",
        email: "buyer@example.com",
        password: "",
        phone: "555-0000",
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PropertyGrid properties={properties} isSaved={() => false} {...props} />
      </MemoryRouter>
    </Provider>,
  );
};

describe("PropertyGrid", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: { firstName: "Alex", phone: "555-0101" } });
  });

  it("renders one card per property, keyed by property id when there are no duplicates", async () => {
    const second = { ...property, id: "2" };
    renderGrid([property, second]);

    expect(await screen.findAllByText("$250,000")).toHaveLength(2);
  });

  // Regression: the same property can appear twice (e.g. a canceled then a
  // fresh tour request for the same listing). Keying purely by property.id
  // collapsed both cards into one and made every request resolve to the
  // first duplicate's status - getKey/getRequestProps keep each entry
  // independent by index instead.
  it("renders a distinct card per entry, not per unique property, when the same property repeats", async () => {
    const requests = [
      { status: "pending" as const, id: "req-1" },
      { status: "accepted" as const, id: "req-2" },
    ];

    renderGrid([property, property], {
      getKey: (_p, index) => requests[index].id,
      getRequestProps: (_p, index) => ({ requestStatus: requests[index].status }),
    });

    const prices = await screen.findAllByText("$250,000");
    expect(prices).toHaveLength(2);
    expect(await screen.findByText("pending")).toBeInTheDocument();
    expect(await screen.findByText("accepted")).toBeInTheDocument();
  });
});
