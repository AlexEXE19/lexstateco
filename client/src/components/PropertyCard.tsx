import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Property } from "../types/types";
import { RootState } from "../state/store";
import { useSelector, useDispatch } from "react-redux";
import {
  setPropertyIdToBeChanged,
  toggleModal,
  setModalType,
} from "../state/modal/modalSlice";
import baseURL from "../config/baseUrl";

// Property card holds the information about a property
const PropertyCard: React.FC<{ property: Property; saved: boolean }> = ({
  property,
  saved,
}) => {
  const dispatch = useDispatch();

  const [sellerName, setSellerName] = useState<string>("");
  const [sellerPhone, setSellerPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(saved);
  const [deleted, setDeleted] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.user);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen
  );

  const navigate = useNavigate();

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  useEffect(() => {
    const checkIfPropertyIsDeleted = async () => {
      try {
        await axios.get(`${baseURL}/properties/${property.id}`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setDeleted(true);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    checkIfPropertyIsDeleted();
  }, [isModalOpen]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/users/${property.sellerId}`
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

  const handleDeleteClick = () => {
    dispatch(setPropertyIdToBeChanged(Number(property.id)));
    dispatch(setModalType("delete"));
    dispatch(toggleModal());
  };

  // const handleDeleteClick = async () => {
  //   try {
  //     await axios.delete(`${baseURL}/properties/${property.id}`);
  //   } catch (error) {
  //     console.error("Error deleting property: ", error);
  //     return;
  //   }
  //   setDeleted(true);
  // };

  const handleEditClick = async () => {
    dispatch(setPropertyIdToBeChanged(Number(property.id)));
    dispatch(setModalType("edit"));
    dispatch(toggleModal());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (deleted) {
    return null;
  }

  return (
    <div className="border p-4 rounded-lg shadow-lg hover:scale-105 hover:bg-stone-100 hover:border-black transition-all">
      <img
        src="/public/default_house.jpg"
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
        <div className="flex justify-between">
          <button
            onClick={handleEditClick}
            className="mt-2 px-4 py-2 bg-amber-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-amber-700 rounded hover:bg-amber-700 transition-all hover:border-amber-500 transition-all"
          >
            Edit Property
          </button>
          <button
            onClick={handleDeleteClick}
            className="mt-2 px-4 py-2 bg-red-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-red-700 rounded hover:bg-red-700 transition-all hover:border-red-500 transition-all"
          >
            Delete Property
          </button>
        </div>
      ) : (
        <button
          onClick={handleSaveClick}
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-blue-700 rounded hover:bg-blue-700 transition-all hover:border-blue-600 transition-all"
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
