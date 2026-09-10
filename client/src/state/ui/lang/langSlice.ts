import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "en" | "ro";

const detectInitial = (): Language => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("lex_lang");
  if (stored === "ro" || stored === "en") return stored;
  const navLang = navigator.language?.toLowerCase() || "";
  if (navLang.startsWith("ro")) return "ro";
  return "en";
};

const initialState: Language = detectInitial();

const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLanguage: (_state, action: PayloadAction<Language>) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lex_lang", action.payload);
      }
      return action.payload;
    },
  },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;
