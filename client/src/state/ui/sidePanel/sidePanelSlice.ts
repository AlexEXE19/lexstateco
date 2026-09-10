import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const sidePanelSlice = createSlice({
  name: "sidePanel",
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggle } = sidePanelSlice.actions;

export default sidePanelSlice.reducer;
