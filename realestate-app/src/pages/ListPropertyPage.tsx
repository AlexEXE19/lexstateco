import { useState } from "react";
import axios from "axios";
import { User } from "../types/types";

interface ListPropertyPageProps {
  currentUser: User;
}

const ListPropertyPage: React.FC<ListPropertyPageProps> = ({ currentUser }) => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number | "">("");
  const [distance, setDistance] = useState<string | "">("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !currentUser.id) {
      alert("User information is missing. Please log in again.");
      return;
    }

    const propertyData = {
      title,
      price: Number(price),
      location,
      description,
      size: Number(size),
      distance: Number(distance),
      sellerId: currentUser.id,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/properties/",
        propertyData
      );
      if (response.status === 201) {
        alert("Property listed successfully!");
      }
    } catch (error) {
      console.error("Error listing the property:", error);
      alert("An error occurred while listing the property. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">List a Property</h2>
      <form onSubmit={handleFormSubmit}>
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
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
          type="text"
          placeholder="Location in the city:"
          className="block w-full p-2 mb-4 border rounded"
          value={distance}
          onChange={(e) => setDistance(e.target.value || "")}
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

export default ListPropertyPage;
