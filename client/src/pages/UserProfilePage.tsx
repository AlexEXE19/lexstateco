import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, BadgeCheck, Home, Heart, Clock, Calendar } from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import { User } from "../schemas/User";

// Not in userSchema yet — placeholders so the layout can be reviewed.
// Swap these for real data once the fields/endpoints exist.
const PLACEHOLDER_AVATAR_URL: string | null = null;
const PLACEHOLDER_IS_AGENT = true;
const PLACEHOLDER_BIO =
  "Add a short bio here — a couple of sentences about who you are and how you help people find a place.";
const PLACEHOLDER_MEMBER_SINCE = "March 2024";
const PLACEHOLDER_LISTED_COUNT = 6;
const PLACEHOLDER_INTERACTED_COUNT = 14;
const PLACEHOLDER_RESPONSE_RATE = "94%";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    if (currentUser === null) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (currentUser === null) {
    return null;
  }

  const initials = `${currentUser.firstName[0] ?? ""}${
    currentUser.lastName[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="bg-canvas px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-3xl">
        {/* Identity */}
        <div className="flex items-start gap-4">
          {PLACEHOLDER_AVATAR_URL ? (
            <img
              src={PLACEHOLDER_AVATAR_URL}
              alt=""
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-50 font-display text-2xl text-primary-800">
              {initials}
            </div>
          )}

          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl text-ink">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              {PLACEHOLDER_IS_AGENT && (
                <span className="inline-flex items-center gap-1 rounded border border-primary-200 bg-primary-50 px-2 py-0.5 text-xs text-primary-800">
                  <BadgeCheck size={12} />
                  Agent
                </span>
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-4 text-sm text-ink-subtle">
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} />
                Member since {PLACEHOLDER_MEMBER_SINCE}
                <span className="text-ink-subtle">(placeholder)</span>
              </span>
              {currentUser.feedbackRating != null && (
                <span className="inline-flex items-center gap-1">
                  <Star size={13} className="text-secondary-500" />
                  {currentUser.feedbackRating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
          {PLACEHOLDER_BIO}{" "}
          <span className="text-xs text-ink-subtle">(placeholder)</span>
        </p>

        {/* Stats — spec-sheet style, matches the property detail page */}
        <div className="mt-8 flex divide-x divide-line border-y border-line">
          <div className="flex-1 py-3 pr-4">
            <div className="flex items-center gap-2 font-display text-xl text-ink">
              <Home size={15} className="text-ink-subtle" />
              {PLACEHOLDER_LISTED_COUNT}
            </div>
            <div className="mt-1 text-sm text-ink-muted">
              Listed properties{" "}
              <span className="text-xs text-ink-subtle">(placeholder)</span>
            </div>
          </div>
          <div className="flex-1 px-4">
            <div className="flex items-center gap-2 font-display text-xl text-ink">
              <Heart size={15} className="text-ink-subtle" />
              {PLACEHOLDER_INTERACTED_COUNT}
            </div>
            <div className="mt-1 text-sm text-ink-muted">
              Properties interacted with{" "}
              <span className="text-xs text-ink-subtle">(placeholder)</span>
            </div>
          </div>
          <div className="flex-1 pl-4">
            <div className="flex items-center gap-2 font-display text-xl text-ink">
              <Clock size={15} className="text-ink-subtle" />
              {PLACEHOLDER_RESPONSE_RATE}
            </div>
            <div className="mt-1 text-sm text-ink-muted">
              Response rate{" "}
              <span className="text-xs text-ink-subtle">(placeholder)</span>
            </div>
          </div>
        </div>

        {/* Contact — real fields */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span>{currentUser.email}</span>
          <span>{currentUser.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
