import { createSlice } from "@reduxjs/toolkit";

interface FeedbackState {
  isOpen: boolean;
}

const initialState: FeedbackState = {
  isOpen: false,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    openFeedbackModal: (state) => {
      state.isOpen = true;
    },
    closeFeedbackModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openFeedbackModal, closeFeedbackModal } = feedbackSlice.actions;
export default feedbackSlice.reducer;
