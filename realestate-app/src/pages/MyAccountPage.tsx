import { useState, useEffect } from "react";
import axios from "axios";
import { Property } from "../types/types";
import PropertyCard from "../components/PropertyCard";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useNavigate } from "react-router-dom";

const MyAccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("saved");

  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number | "">("");
  const [distance, setDistance] = useState<number | "">("");

  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  const firstName = useSelector((state: RootState) => state.user.firstName);
  const userId = useSelector((state: RootState) => state.user.id);

  const navigate = useNavigate();

  useEffect(() => {
    if (userId === "-1") {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const savedResponse = await axios.get(
          `http://localhost:5000/saved-properties/${userId}`
        );

        const propertyIds = savedResponse.data.map(
          (propertyIdObject: { property_id: string }) =>
            propertyIdObject.property_id
        );

        const propertyPromises = propertyIds.map((id: string) =>
          axios.get(`http://localhost:5000/properties/${id}`)
        );

        const propertyResponses = await Promise.all(propertyPromises);

        const saved = propertyResponses.map((res) => res.data);

        setSavedProperties(saved);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };

    const fetchMyProperties = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/properties/seller-id/${userId}`
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

    if (activeTab === "saved") {
      fetchSavedProperties();
    } else if (activeTab === "myProperties") {
      fetchMyProperties();
    }
  }, [activeTab]);

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
      const response = await axios.post(
        "http://localhost:5000/properties/",
        propertyData
      );
      if (response.status === 201) {
        alert("Property has been listed successfully!");
        setTitle("");
        setPrice("");
        setLocationInput("");
        setDescription("");
        setSize("");
        setDistance("");
        setActiveTab("myProperties");
      }
    } catch (error) {
      console.error("Error listing the property:", error);
      alert("An error occurred while listing the property. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Welcome, {firstName}</h1>
      <div className="space-x-4 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "saved" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Properties
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "myProperties"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("myProperties")}
        >
          My Properties
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "list" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List a Property
        </button>
      </div>

      <div>
        {activeTab === "saved" && (
          <div>
            {savedProperties.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Your Saved Properties
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {savedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property[0]} />
                  ))}
                </div>
              </>
            ) : (
              <h2 className="text-xl font-semibold mb-4">
                Let's find some nice properties!
              </h2>
            )}
          </div>
        )}

        {activeTab === "myProperties" && (
          <div>
            {properties.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            ) : (
              <h2 className="text-xl font-semibold mb-4">
                Let's list a property!
              </h2>
            )}
          </div>
        )}

        {activeTab === "list" && (
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
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
