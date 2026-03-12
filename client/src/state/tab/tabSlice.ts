import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  type: string;
}

const initialState: TabState = {
  type: "saved",
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;
export default tabSlice.reducer;
