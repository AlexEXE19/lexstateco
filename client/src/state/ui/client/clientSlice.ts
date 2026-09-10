import { createSlice } from "@reduxjs/toolkit";

export interface ClientState {
  city: string;
  region: string;
  countryName: string;
  countryCode: string;
  timezone: string;
  countryCallingCode: string;
  currency: string;
}

const initialState: ClientState = {
  city: "Bucharest",
  region: "Bucharest",
  countryName: "Romania",
  countryCode: "RO",
  timezone: "Europe/Bucharest",
  countryCallingCode: "+40",
  currency: "RON",
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientState: (state, action) => {
      state = action.payload;
    },
    changePreferredCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setClientState, changePreferredCurrency } = clientSlice.actions;
export default clientSlice.reducer;
