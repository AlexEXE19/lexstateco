import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SavedPropertiesTab from "../features/properties/components/tabs/SavedPropertiesTab";
import UserPropertiesTab from "../features/properties/components/tabs/UserPropertiesTab";
import PropertyListingTab from "../features/properties/components/tabs/PropertyListingTab";
import MyAudienceTab from "../features/tour-requests/components/MyAudienceTab";
import MyRequestsTab from "../features/tour-requests/components/MyRequestsTab";
import MessagesTab from "../features/messaging/components/MessagesTab";

import { getCurrentUser } from "../utils/auth";
import { User } from "../schemas/user/User";

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
          <MessagesTab activeConversationId={"1"} />
        )}
      </section>
    </div>
  );
};

export default ManagePage;
