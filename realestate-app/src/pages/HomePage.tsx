import { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { Property } from "../types/types";

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [proximity, setProximity] = useState<string>("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/properties");
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = () => {
    let filtered = properties;

    if (location) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(
        (property) => property.price >= parseInt(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (property) => property.price <= parseInt(maxPrice)
      );
    }

    if (proximity) {
      filtered = filtered.filter((property) => property.distance === proximity);
    }

    setFilteredProperties(filtered);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">All Properties</h1>

      {/* Filters and Search Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
        />

        <select
          value={proximity}
          onChange={(e) => setProximity(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
        >
          <option value="">Proximity to City Center</option>
          <option value="City Center">City Center</option>
          <option value="Around the Center">Around the Center</option>
          <option value="Suburbs">Suburbs</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
