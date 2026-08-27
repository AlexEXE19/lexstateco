import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../config/baseUrl";

// Property detail panel needs the seller's full name and phone, not just
// the first name PropertyCard shows - kept separate from
// usePropertyCardData rather than shared, since changing that hook's
// shape would also change what every card renders.
export const useSellerInfo = (sellerId: number) => {
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSellerInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/users/${sellerId}`);
        if (!cancelled && response.data?.firstName) {
          const fullName = [response.data.firstName, response.data.lastName]
            .filter(Boolean)
            .join(" ");
          setSellerName(fullName);
          setSellerPhone(response.data.phone || "");
        }
      } catch (error) {
        console.error("Error fetching seller information:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSellerInfo();
    return () => {
      cancelled = true;
    };
  }, [sellerId]);

  return { sellerName, sellerPhone, loading };
};
