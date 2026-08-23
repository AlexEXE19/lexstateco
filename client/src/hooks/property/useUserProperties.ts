import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";
import { Property } from "../../types/types";

export const useUserProperties = (userId: string) => {
  const [properties, setProperties] = useState<Property[]>();

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/properties/seller-id/${userId}`,
        );
        setProperties(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setProperties([]);
          } else {
            console.error("Error fetching user properties:", error);
          }
        } else {
          console.error("Unknown error:", error);
        }
      }
    };
    fetchMyProperties();
  }, [userId]);

  return { properties };
};
