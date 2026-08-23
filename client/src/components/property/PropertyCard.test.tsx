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
import userReducer from "../../state/user/userSlice";
import langReducer from "../../state/lang/langSlice";
import { Property } from "../../types/types";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const property: Property = {
  id: 1,
  title: "Sunny Downtown Loft",
  description: "A bright open-plan loft close to shops and transit.",
  location: "Springfield",
  neighborhood: "Downtown",
  zipCode: "62701",
  price: 250000,
  size: 850,
  imageRefs: [],
  sellerId: 2,
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

  it("renders property and seller details once loaded", async () => {
    renderCard();

    expect(await screen.findByText("Sunny Downtown Loft")).toBeInTheDocument();
    expect(screen.getByText(/Alex/)).toBeInTheDocument();
    expect(screen.getByText("Springfield")).toBeInTheDocument();
  });

  it("shows edit/delete actions only to the property's owner", async () => {
    renderCard({}, { userId: "2" }); // matches property.sellerId

    await screen.findByText("Sunny Downtown Loft");
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("hides edit/delete actions from non-owners", async () => {
    renderCard({}, { userId: "3" });

    await screen.findByText("Sunny Downtown Loft");
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("opens the delete confirmation and calls the delete endpoint on confirm", async () => {
    renderCard({}, { userId: "2" });
    await screen.findByText("Sunny Downtown Loft");

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
    await screen.findByText("Sunny Downtown Loft");

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

  it("opens the edit modal pre-filled with the property's own data", async () => {
    renderCard({}, { userId: "2" });
    await screen.findByText("Sunny Downtown Loft");

    fireEvent.click(screen.getByText("Edit"));

    expect(await screen.findByText("Edit property")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sunny Downtown Loft")).toBeInTheDocument();
    expect(screen.getByDisplayValue("250000")).toBeInTheDocument();
    // No network call needed to populate the form - it comes straight
    // from the property prop already held by the card.
    expect(mockedAxios.get).not.toHaveBeenCalledWith(
      expect.stringContaining(`/properties/${property.id}`),
    );
  });

  it("toggles saved state through the save/unsave endpoints", async () => {
    renderCard({ saved: false }, { userId: "3" });
    await screen.findByText("Sunny Downtown Loft");

    const saveButton = screen.getByLabelText("Save property");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/saved-properties"),
        expect.objectContaining({ userId: "3", propertyId: 1 }),
      );
    });

    await screen.findByLabelText("Unsave property");
  });
});
