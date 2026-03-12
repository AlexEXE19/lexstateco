import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import modalReducer from "./modal/modalSlice.ts";
import tabReducer from "./tab/tabSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    tab: tabReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
