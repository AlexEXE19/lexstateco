import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import tabReducer from "./tab/tabSlice";
import langReducer from "./lang/langSlice";
import feedbackReducer from "./feedback/feedbackSlice";
import propertyModalReducer from "./propertyModal/propertyModalSlice";
import clientReducer from "./client/clientSlice";
import sidePanelReducer from "./sidePanel/sidePanelSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tab: tabReducer,
    lang: langReducer,
    feedback: feedbackReducer,
    propertyModal: propertyModalReducer,
    client: clientReducer,
    sidePanel: sidePanelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
