import React, { useEffect, useState } from "react";
import axios from "axios";
import { Property } from "../types/types";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [sellerName, setSellerName] = useState<string>("");
  const [sellerPhone, setSellerPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    console.log("Seller ID in PropertyCard:", property.sellerId);

    if (!property.sellerId) {
      console.error("Seller ID is undefined!");
      setLoading(false);
      return;
    }

    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${property.sellerId}`
        );
        console.log("API Response:", response.data);

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
    try {
      if (!saved) {
        // Save the property
        const response = await axios.post(
          "http://localhost:5000/saved-properties",
          {
            userId: property.sellerId,
            propertyId: property.id,
          }
        );
        console.log("Property saved:", response.data);
      } else {
        // Unsave the property
        const response = await axios.delete(
          "http://localhost:5000/saved-properties",
          {
            data: {
              userId: property.sellerId,
              propertyId: property.id,
            },
          }
        );
        console.log("Property unsaved:", response.data);
      }
      setSaved(!saved); // Toggle the saved state after a successful API call
    } catch (error) {
      console.error("Error saving or unsaving property:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
      <button
        onClick={handleSaveClick}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        {saved ? "Unsave" : "Save Property"}{" "}
      </button>
    </div>
  );
};

export default PropertyCard;
