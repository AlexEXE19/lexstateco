import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import { Property } from "../types/types";

const UserPropertiesTab: React.FC = () => {
  const [userProperties, setUserProperties] = useState<Property[]>();

  const userId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/properties/seller-id/${userId}`
        );
        setUserProperties(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setUserProperties([]);
          } else {
            console.error("Error fetching user properties:", error);
          }
        } else {
          console.error("Unknown error:", error);
        }
      }
    };
    fetchMyProperties();
  });

  return (
    <div>
      {userProperties && userProperties.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userProperties.map((userProperty) => (
              <PropertyCard
                key={userProperty.id}
                property={userProperty}
                saved={false}
              />
            ))}
          </div>
        </>
      ) : (
        <h2 className="text-xl font-semibold mb-4">Let's list a property!</h2>
      )}
    </div>
  );
};

export default UserPropertiesTab;
