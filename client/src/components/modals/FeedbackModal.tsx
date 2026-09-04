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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-line bg-background-surface shadow-panel">
        <div className="flex items-center gap-3 border-b border-line px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-700">
            <MessageSquareHeart size={20} />
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <div>
              <p className="eyebrow">
                We value your input
              </p>
              <h2 className="mt-1 font-display text-lg text-ink">
                How is your experience?
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 text-ink-muted">
          {submitted ? (
            <div className="py-6 text-center">
              <p className="font-display text-lg text-ink">
                Thank you for your feedback!
              </p>
              <p className="mt-1.5 text-sm text-ink-subtle">
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
                          ? "fill-secondary-400 text-secondary-400"
                          : "text-line-strong"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="btn-primary"
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
