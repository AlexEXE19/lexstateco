import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import SavedPropertiesTab from "../components/SavedPropertiesTab";
import UserPropertiesTab from "../components/UserPropertiesTab";
import PropertyListingTab from "../components/PropertyListingTab";
import MyAudienceTab from "../components/MyAudienceTab";
import { getCurrentUser } from "../utils/auth";
import { User } from "../types/types";
import { setTab } from "../state/tab/tabSlice";

const MyAccountPage: React.FC = () => {
  const activeTab = useSelector((state: RootState) => state.tab).type;
  const dispatch = useDispatch();

  const firstName = useSelector((state: RootState) => state.user.firstName);
  const userId = useSelector((state: RootState) => state.user.id);

  const navigate = useNavigate();

  const [currentUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    if (currentUser === null) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/80 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
            My account
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="max-w-2xl text-slate-200">
            Manage your saved homes, your listings, and your audience in one
            calm workspace.
          </p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap gap-3 rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur">
            {[
              { key: "saved", label: "Saved" },
              { key: "myProperties", label: "My Properties" },
              { key: "list", label: "List a Property" },
              { key: "requests", label: "My Requests" },
              { key: "audience", label: "My Audience" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => dispatch(setTab(tab.key))}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            {activeTab === "saved" && <SavedPropertiesTab />}
            {activeTab === "myProperties" && <UserPropertiesTab />}
            {activeTab === "list" && <PropertyListingTab />}
            {activeTab === "audience" && <MyAudienceTab />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountPage;
