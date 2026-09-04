import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SavedPropertiesTab from "../components/property/SavedPropertiesTab";
import UserPropertiesTab from "../components/property/UserPropertiesTab";
import PropertyListingTab from "../components/property/PropertyListingTab";
import MyAudienceTab from "../components/tour-requests/MyAudienceTab";
import MyRequestsTab from "../components/tour-requests/MyRequestsTab";
import MessagesTab from "../components/messaging/MessagesTab";

import { getCurrentUser } from "../utils/auth";
import { User } from "../schemas/User";

const ManagePage: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser] = useState<User | null>(getCurrentUser());

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (currentUser === null) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (currentUser === null) {
    return null;
  }

  return (
    <div className="bg-canvas">
      <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-12">
        {searchParams.get("activeTab") === "saved" && <SavedPropertiesTab />}
        {searchParams.get("activeTab") === "myProperties" && (
          <UserPropertiesTab />
        )}
        {searchParams.get("activeTab") === "list" && <PropertyListingTab />}
        {searchParams.get("activeTab") === "requests" && <MyRequestsTab />}
        {searchParams.get("activeTab") === "audience" && <MyAudienceTab />}
        {searchParams.get("activeTab") === "messages" && (
          <MessagesTab activeConversationId={1} />
        )}
      </section>
    </div>
  );
};

export default ManagePage;
