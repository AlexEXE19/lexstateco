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
    <div className="min-h-screen bg-background px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Identity */}
        <div className="flex items-start gap-4">
          {PLACEHOLDER_AVATAR_URL ? (
            <img
              src={PLACEHOLDER_AVATAR_URL}
              alt=""
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-2xl font-semibold text-primary-200">
              {initials}
            </div>
          )}

          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-white">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              {PLACEHOLDER_IS_AGENT && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-2 py-0.5 text-xs text-primary-300 ring-1 ring-primary-400/20">
                  <BadgeCheck size={12} />
                  Agent
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} />
                Member since {PLACEHOLDER_MEMBER_SINCE}
                <span className="text-slate-600">(placeholder)</span>
              </span>
              {currentUser.feedbackRating != null && (
                <span className="inline-flex items-center gap-1">
                  <Star size={13} className="text-amber-400" />
                  {currentUser.feedbackRating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-slate-300">
          {PLACEHOLDER_BIO}{" "}
          <span className="text-xs text-slate-600">(placeholder)</span>
        </p>

        {/* Stats — spec-sheet style, matches the property detail page */}
        <div className="mt-6 flex divide-x divide-white/10 border-y border-white/10">
          <div className="flex-1 py-3 pr-4">
            <div className="flex items-center gap-1.5 text-xl font-semibold text-white">
              <Home size={16} className="text-slate-500" />
              {PLACEHOLDER_LISTED_COUNT}
            </div>
            <div className="text-sm text-slate-400">
              Listed properties{" "}
              <span className="text-xs text-slate-600">(placeholder)</span>
            </div>
          </div>
          <div className="flex-1 px-4">
            <div className="flex items-center gap-1.5 text-xl font-semibold text-white">
              <Heart size={16} className="text-slate-500" />
              {PLACEHOLDER_INTERACTED_COUNT}
            </div>
            <div className="text-sm text-slate-400">
              Properties interacted with{" "}
              <span className="text-xs text-slate-600">(placeholder)</span>
            </div>
          </div>
          <div className="flex-1 pl-4">
            <div className="flex items-center gap-1.5 text-xl font-semibold text-white">
              <Clock size={16} className="text-slate-500" />
              {PLACEHOLDER_RESPONSE_RATE}
            </div>
            <div className="text-sm text-slate-400">
              Response rate{" "}
              <span className="text-xs text-slate-600">(placeholder)</span>
            </div>
          </div>
        </div>

        {/* Contact — real fields */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
          <span>{currentUser.email}</span>
          <span>{currentUser.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
