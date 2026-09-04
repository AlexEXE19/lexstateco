import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Property } from "../../schemas/Property";
interface PropertyModalState {
  isOn: boolean;
  property: Property | null;
}

const initialState: PropertyModalState = {
  isOn: false,
  property: null,
};

const propertyModalSlice = createSlice({
  name: "propertyModal",
  initialState,
  reducers: {
    openPropertyModal: (state, action: PayloadAction<Property>) => {
      state.isOn = false;
      state.property = action.payload;
    },
    closePropertyModal: (state) => {
      state.isOn = false;
      state.property = null;
    },
  },
});

export const { openPropertyModal, closePropertyModal } =
  propertyModalSlice.actions;
export default propertyModalSlice.reducer;
