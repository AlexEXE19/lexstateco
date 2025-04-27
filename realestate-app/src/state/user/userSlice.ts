import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/types";

const initialState: User = {
  id: "-1",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.phone = action.payload.phone;
    },
    logOutUser: () => initialState,
  },
});

export const { logInUser, logOutUser } = userSlice.actions;

export default userSlice.reducer;
