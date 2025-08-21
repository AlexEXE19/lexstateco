import { useState, useEffect } from "react";

import SavedPropertiesTab from "../components/SavedPropertiesTab";
import UserPropertiesTab from "../components/UserPropertiesTab";
import PropertyListingTab from "../components/PropertyListingTab";

import { useSelector } from "react-redux";
import { RootState } from "../state/store";

import { useNavigate } from "react-router-dom";
import MyAudienceTab from "../components/MyAudienceTab";

const MyAccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("saved");

  const firstName = useSelector((state: RootState) => state.user.firstName);
  const userId = useSelector((state: RootState) => state.user.id);

  const navigate = useNavigate();

  useEffect(() => {
    if (userId === "-1") {
      navigate("/");
    }
  }, [userId, navigate]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4 pt-28">
        Welcome back, {firstName}!
      </h1>
      <hr />
      <div className="flex gap-4 my-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "saved"
              ? "bg-blue-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-blue-700 rounded hover:bg-blue-700 transition-all hover:border-blue-600 transition-all"
              : "bg-gray-300 text-gray-800 text-lg font-bold rounded shadow-2 shadow-md border border-black rounded hover:bg-gray-700 hover:text-white transition-all hover:border-black transition-all"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Properties
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "myProperties"
              ? "bg-blue-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-blue-700 rounded hover:bg-blue-700 transition-all hover:border-blue-600 transition-all"
              : "bg-gray-300 text-gray-800 text-lg font-bold rounded shadow-2 shadow-md border border-black rounded hover:bg-gray-700 hover:text-white transition-all hover:border-black transition-all"
          }`}
          onClick={() => setActiveTab("myProperties")}
        >
          My Properties
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "list"
              ? "bg-blue-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-blue-700 rounded hover:bg-blue-700 transition-all hover:border-blue-600 transition-all"
              : "bg-gray-300 text-gray-800 text-lg font-bold rounded shadow-2 shadow-md border border-black rounded hover:bg-gray-700 hover:text-white transition-all hover:border-black transition-all"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List a Property
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "audience"
              ? "bg-blue-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-blue-700 rounded hover:bg-blue-700 transition-all hover:border-blue-600 transition-all"
              : "bg-gray-300 text-gray-800 text-lg font-bold rounded shadow-2 shadow-md border border-black rounded hover:bg-gray-700 hover:text-white transition-all hover:border-black transition-all"
          }`}
          onClick={() => setActiveTab("audience")}
        >
          My Audience
        </button>
      </div>
      <hr />
      <div>
        {activeTab === "saved" && <SavedPropertiesTab />}

        {activeTab === "myProperties" && <UserPropertiesTab />}

        {activeTab === "list" && <PropertyListingTab />}

        {activeTab === "audience" && <MyAudienceTab />}
      </div>
    </div>
  );
};

export default MyAccountPage;
