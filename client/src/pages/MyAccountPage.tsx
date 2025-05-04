import { useState, useEffect } from "react";

import SavedPropertiesTab from "../components/SavedPropertiesTab";
import UserPropertiesTab from "../components/UserPropertiesTab";
import PropertyListingTab from "../components/PropertyListingTab";

import { useSelector } from "react-redux";
import { RootState } from "../state/store";

import { useNavigate } from "react-router-dom";

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
      <h1 className="text-3xl font-semibold mb-4">Welcome, {firstName}</h1>
      <div className="space-x-4 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "saved" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Properties
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "myProperties"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("myProperties")}
        >
          My Properties
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "list" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List a Property
        </button>
      </div>

      <div>
        {activeTab === "saved" && <SavedPropertiesTab />}

        {activeTab === "myProperties" && <UserPropertiesTab />}

        {activeTab === "list" && <PropertyListingTab />}
      </div>
    </div>
  );
};

export default MyAccountPage;
