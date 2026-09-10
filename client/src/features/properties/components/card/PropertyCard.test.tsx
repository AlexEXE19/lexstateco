import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import userReducer from "../../../../state/user/userSlice";
import langReducer from "../../../../state/ui/lang/langSlice";
import { Property } from "../../../../schemas/property/Property";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const property: Property = {
  id: "1",
  agentId: 2,
  price: 250000,
  imageRefs: [],
  location: {
    country: "USA",
    city: "Springfield",
    neighborhood: "Downtown",
    address: "12 Main St",
    zipCode: "62701",
  },
  description: "A bright open-plan loft close to shops and transit.",
  size: "850",
  status: "available",
  type: "apartment",
  bedrooms: 2,
  bathrooms: 1,
  amenities: [],
};

const renderCard = (
  props: Partial<React.ComponentProps<typeof PropertyCard>> = {},
  { userId = "3" } = {},
) => {
  const store = configureStore({
    reducer: { user: userReducer, lang: langReducer },
    preloadedState: {
      user: {
        id: userId,
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
        <PropertyCard property={property} saved={false} {...props} />
      </MemoryRouter>
    </Provider>,
  );
};

describe("PropertyCard", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: { firstName: "Alex", phone: "555-0101" },
    });
    mockedAxios.post.mockResolvedValue({ data: {} });
    mockedAxios.delete.mockResolvedValue({ data: {} });
  });

  it("renders price, facts and address once loaded", async () => {
    renderCard();

    expect(await screen.findByText("$250,000")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("850")).toBeInTheDocument();
    expect(
      screen.getByText("12 Main St, Downtown, Springfield"),
    ).toBeInTheDocument();
  });

  it("shows edit/delete actions only to the property's owner", async () => {
    renderCard({}, { userId: "2" }); // matches property.agentId

    await screen.findByText("$250,000");
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("hides edit/delete actions from non-owners", async () => {
    renderCard({}, { userId: "3" });

    await screen.findByText("$250,000");
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("opens the delete confirmation and calls the delete endpoint on confirm", async () => {
    renderCard({}, { userId: "2" });
    await screen.findByText("$250,000");

    fireEvent.click(screen.getByText("Delete"));
    expect(
      await screen.findByText("This cannot be undone"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete listing"));

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/properties/${property.id}`),
      );
    });
  });

  it("cancelling the delete confirmation does not call the delete endpoint", async () => {
    renderCard({}, { userId: "2" });
    await screen.findByText("$250,000");

    fireEvent.click(screen.getByText("Delete"));
    await screen.findByText("This cannot be undone");

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("This cannot be undone"),
      ).not.toBeInTheDocument();
    });
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });

  it("toggles saved state through the save/unsave endpoints", async () => {
    renderCard({ saved: false }, { userId: "3" });
    await screen.findByText("$250,000");

    const saveButton = screen.getByLabelText("Save property");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/saved-properties"),
        expect.objectContaining({ userId: "3", propertyId: "1" }),
      );
    });

    await screen.findByLabelText("Unsave property");
  });

  it("does not show the save button to the property's owner", async () => {
    renderCard({}, { userId: "2" });
    await screen.findByText("$250,000");

    expect(screen.queryByLabelText("Save property")).not.toBeInTheDocument();
  });
});
