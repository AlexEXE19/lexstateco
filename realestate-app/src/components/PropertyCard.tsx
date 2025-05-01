import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Property } from "../types/types";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";

const PropertyCard: React.FC<{ property: Property; saved: boolean }> = ({
  property,
  saved,
}) => {
  const [sellerName, setSellerName] = useState<string>("");
  const [sellerPhone, setSellerPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(saved);
  const [deleted, setDeleted] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${property.sellerId}`
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
  }, [property.sellerId]);

  const handleSaveClick = async () => {
    if (currentUser.id === "-1") {
      navigate("/register");
      return;
    }
    try {
      if (!isSaved) {
        await axios.post("http://localhost:5000/saved-properties", {
          userId: currentUser.id,
          propertyId: property.id,
        });
      } else {
        await axios.delete("http://localhost:5000/saved-properties", {
          data: {
            userId: currentUser.id,
            propertyId: property.id,
          },
        });
      }
      setIsSaved((isSaved) => !isSaved);
    } catch (error) {
      console.error("Error saving or unsaving property:", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:5000/properties/${property.id}`);
    } catch (error) {
      console.error("Error deleting property: ", error);
      return;
    }
    setDeleted(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (deleted) {
    return null;
  }

  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <img
        src="/images/default_house.jpg"
        alt="Property"
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h2 className="text-xl font-semibold">{property.title}</h2>
      <p>{property.description}</p>
      <p className="text-sm text-gray-500">{property.location}</p>
      <p className="font-bold">{property.price} $</p>
      <p className="text-sm">{property.size} sq ft</p>
      <p className="text-sm">Distance: {property.distance}</p>
      <p className="text-sm">
        Agent's name and phone: {sellerName} - {sellerPhone}
      </p>
      {String(property.sellerId) === String(currentUser.id) ? (
        <button
          onClick={handleDeleteClick}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Delete Property
        </button>
      ) : (
        <button
          onClick={handleSaveClick}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {currentUser.id === "-1"
            ? "Register to save this property!"
            : isSaved
            ? "Unsave"
            : "Save Property"}
        </button>
      )}
    </div>
  );
};

export default PropertyCard;
