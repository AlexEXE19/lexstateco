import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import tabReducer from "./tab/tabSlice";
import langReducer from "./lang/langSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tab: tabReducer,
    lang: langReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
