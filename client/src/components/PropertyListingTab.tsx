import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../config/baseUrl";

// Tab for listing a property
const PropertyListingTab: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number | "">("");
  const [distance, setDistance] = useState<number | "">("");
  const userId = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      title,
      price: Number(price),
      location: locationInput,
      description,
      size: Number(size),
      distance: Number(distance),
      sellerId: userId,
    };

    try {
      const response = await axios.post(`${baseURL}/properties/`, propertyData);
      if (response.status === 201) {
        alert("Property has been listed successfully!");
        setTitle("");
        setPrice("");
        setLocationInput("");
        setDescription("");
        setSize("");
        setDistance("");
        navigate("/account");
      }
    } catch (error) {
      console.error("Error listing the property:", error);
      alert("An error occurred while listing the property. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">List a Property</h2>
      <form onSubmit={handleFormSubmit} className="max-w-md mt-4">
        <input
          type="text"
          placeholder="Title"
          className="block w-full p-2 mb-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="block w-full p-2 mb-2 border rounded"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || "")}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="block w-full p-2 mb-2 border rounded"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="block w-full p-2 mb-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Size (sq ft)"
          className="block w-full p-2 mb-2 border rounded"
          value={size}
          onChange={(e) => setSize(Number(e.target.value) || "")}
          required
        />
        <input
          type="number"
          placeholder="Distance to center (km)"
          className="block w-full p-2 mb-4 border rounded"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value) || "")}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          List Property
        </button>
      </form>
    </div>
  );
};

export default PropertyListingTab;
