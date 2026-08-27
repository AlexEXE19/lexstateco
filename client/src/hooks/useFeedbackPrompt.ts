import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import baseURL from "../config/baseUrl";
import { RootState } from "../state/store";
import { openFeedbackModal } from "../state/feedback/feedbackSlice";

const dismissedKey = (userId: string) => `lex_feedback_dismissed_${userId}`;

// Call promptForFeedback() after a "milestone" action succeeds (listing a
// property, requesting a tour, sending a first message). It only actually
// opens the modal if the user hasn't already given feedback (server-side
// truth, via feedbackRating) and hasn't dismissed the prompt before
// (client-side only, for now - no server field for that yet).
export const useFeedbackPrompt = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);

  const promptForFeedback = async () => {
    if (userId === "-1") return;

    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem(dismissedKey(userId))
    ) {
      return;
    }

    try {
      const res = await axios.get(`${baseURL}/users/${userId}`);
      if (res.data?.feedbackRating != null) return;
      dispatch(openFeedbackModal());
    } catch (err) {
      console.error("Error checking feedback status", err);
    }
  };

  return { promptForFeedback };
};

export const dismissFeedbackPrompt = (userId: string) => {
  if (typeof window === "undefined" || userId === "-1") return;
  window.localStorage.setItem(dismissedKey(userId), "1");
};
