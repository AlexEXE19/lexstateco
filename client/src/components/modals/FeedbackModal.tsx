import axios from "axios";
import { Star, MessageSquareHeart, Sparkles } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import baseURL from "../../config/baseUrl";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const userId = useSelector((state: RootState) => state.user.id);

  if (!isOpen || userId === "-1") return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitted(true);

    try {
      await axios.put(`${baseURL}/users/${userId}/give-feedback`, { rating });
    } catch (err) {
      console.error(err);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-surface/40 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-white via-rose-50 to-amber-50 shadow-2xl ring-1 ring-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-200/70 px-6 py-4 bg-white/70 backdrop-blur">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <MessageSquareHeart size={20} />
          </div>
          <div className="flex items-center gap-2 text-amber-800">
            <Sparkles size={16} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-700">
                We value your input
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                How is your experience?
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 text-slate-700">
          {submitted ? (
            <div className="py-6 text-center">
              <p className="text-lg font-semibold text-slate-900">
                Thank you for your feedback!
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Your response has been recorded.
              </p>
            </div>
          ) : (
            <>
              <p>
                Please take a moment to rate your overall experience with the
                application. Your feedback helps us improve.
              </p>

              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`${
                        (hoveredRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-400/40 transition hover:-translate-y-[1px] hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Submit feedback
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FeedbackModal;
