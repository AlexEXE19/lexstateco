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
      {/* <h1 className="text-3xl font-semibold mb-4 pt-28">
        Welcome back, {firstName}!
      </h1> */}
      <hr />
      <div className="p-5 pb-0 bg-blue-100">
        <button
          className={`px-4 py-2 bg-blue-100 text-blue-600 text-xl font-bold border-b-2 hover:border-b-2 hover:border-b-blue-600 transition-all${
            activeTab === "saved" ? "border-b-blue-600" : "border-b-blue-100"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Properties
        </button>
        <button
          className={`px-4 py-2 bg-blue-100 text-blue-600 text-xl font-bold border-b-2 hover:border-b-2 hover:border-b-blue-600 transition-all${
            activeTab === "saved" ? "border-b-blue-600" : "border-b-blue-100"
          }`}
          onClick={() => setActiveTab("myProperties")}
        >
          My Properties
        </button>
        <button
          className={`px-4 py-2 bg-blue-100 text-blue-600 text-xl font-bold border-b-2 hover:border-b-2 hover:border-b-blue-600 transition-all${
            activeTab === "saved" ? "border-b-blue-600" : "border-b-blue-100"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List a Property
        </button>
        <button
          className={`px-4 py-2 bg-blue-100 text-blue-600 text-xl font-bold border-b-2 hover:border-b-2 hover:border-b-blue-600 transition-all${
            activeTab === "saved" ? "border-b-blue-600" : "border-b-blue-100"
          }`}
          onClick={() => setActiveTab("audience")}
        >
          My Audience
        </button>
      </div>
      <hr />
      <div className="px-10 min-h-screen">
        {activeTab === "saved" && <SavedPropertiesTab />}

        {activeTab === "myProperties" && <UserPropertiesTab />}

        {activeTab === "list" && <PropertyListingTab />}

        {activeTab === "audience" && <MyAudienceTab />}
      </div>
    </div>
  );
};

export default MyAccountPage;
