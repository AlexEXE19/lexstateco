import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import baseURL from "../../config/baseUrl";
import { Property } from "../../schemas/Property";

export const usePropertyCardData = (property: Property, saved: boolean) => {
  const currentUser = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [sellerName, setSellerName] = useState<string>("");
  const [sellerPhone, setSellerPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(saved);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<number>(0);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  useEffect(() => {
    setActiveImage(0);
  }, [property.id]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/users/${property.agentId}`,
        );
        if (response.data.firstName && response.data.phone) {
          setSellerName(response.data.firstName);
          setSellerPhone(response.data.phone);
        } else {
          console.error("Missing data in API response for seller.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller information:", error);
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, [property.agentId]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser.id === "-1") {
      navigate("/register");
      return;
    }
    try {
      if (!isSaved) {
        await axios.post(`${baseURL}/saved-properties`, {
          userId: currentUser.id,
          propertyId: property.id,
        });
      } else {
        await axios.delete(`${baseURL}/saved-properties`, {
          data: {
            userId: currentUser.id,
            propertyId: property.id,
          },
        });
      }
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Error saving or unsaving property:", error);
    }
  };

  const priceLabel = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(property.price),
    [property.price],
  );

  const imageCount = property.imageRefs?.length || 0;
  const base = baseURL.replace(/\/$/, "");
  const currentImage =
    imageCount > 0
      ? `${base}/${property.imageRefs[activeImage % imageCount]}`
      : "/default_house.jpg";

  const nextImage = (delta: number) => {
    if (imageCount === 0) return;
    setActiveImage((idx) => (idx + delta + imageCount) % imageCount);
  };

  return {
    currentUser,
    sellerName,
    sellerPhone,
    loading,
    isSaved,
    deleted,
    setDeleted,
    activeImage,
    setActiveImage,
    handleSaveClick,
    priceLabel,
    imageCount,
    currentImage,
    nextImage,
  };
};
