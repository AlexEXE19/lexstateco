import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import tabReducer from "./tab/tabSlice";
import langReducer from "./ui/lang/langSlice";
import feedbackReducer from "./ui/feedback/feedbackSlice";
import propertyModalReducer from "./ui/propertyModal/propertyModalSlice";
import clientReducer from "./ui/client/clientSlice";
import sidePanelReducer from "./ui/sidePanel/sidePanelSlice";

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
