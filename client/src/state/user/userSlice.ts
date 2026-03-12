import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/types";
import {
  clearAuthToken,
  decodeUserFromToken,
  getStoredToken,
  setAuthToken,
} from "../../utils/auth";

// User with id "-1" is considered as no user is logged on the page
const anonymousUser: User = {
  id: "-1",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
};

const getInitialUser = (): User => {
  const token = getStoredToken();
  if (!token) return anonymousUser;
  setAuthToken(token);
  const decoded = decodeUserFromToken(token);
  return decoded || anonymousUser;
};

const initialState: User = getInitialUser();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.password = "";
      state.phone = action.payload.phone;
    },
    logOutUser: () => {
      clearAuthToken();
      return anonymousUser;
    },
  },
});

export const { logInUser, logOutUser } = userSlice.actions;

export default userSlice.reducer;
