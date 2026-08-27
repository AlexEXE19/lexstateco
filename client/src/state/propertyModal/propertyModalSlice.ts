import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Property } from "../../types/types";

interface PropertyModalState {
  property: Property | null;
}

const initialState: PropertyModalState = {
  property: null,
};

const propertyModalSlice = createSlice({
  name: "propertyModal",
  initialState,
  reducers: {
    openPropertyModal: (state, action: PayloadAction<Property>) => {
      state.property = action.payload;
    },
    closePropertyModal: (state) => {
      state.property = null;
    },
  },
});

export const { openPropertyModal, closePropertyModal } =
  propertyModalSlice.actions;
export default propertyModalSlice.reducer;
