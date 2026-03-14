import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  type: string;
  conversationId: number | null;
}

const initialState: TabState = {
  type: "saved",
  conversationId: null,
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab: (
      state,
      action: PayloadAction<
        string | { type: string; conversationId?: number | null }
      >,
    ) => {
      const payload =
        typeof action.payload === "string"
          ? { type: action.payload, conversationId: null }
          : action.payload;
      state.type = payload.type;
      state.conversationId = payload.conversationId ?? null;
    },
    setConversationId: (state, action: PayloadAction<number | null>) => {
      state.conversationId = action.payload;
    },
  },
});

export const { setTab, setConversationId } = tabSlice.actions;
export default tabSlice.reducer;
