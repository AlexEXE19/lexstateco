import { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { Property } from "../types/types";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";
import baseURL from "../config/baseUrl";

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [savedPropertiesIds, setSavedPropertiesIds] = useState<string[]>([]);
  const [noOfPages, setNoOfPages] = useState<Number>(1);
  const [propertiesOnPage, setPropertiesOnPage] = useState<number>(24);

  const [location, setLocation] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [proximity, setProximity] = useState<string>("");

  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get<Property[]>(`${baseURL}/properties`);
        setProperties(response.data);
        setFilteredProperties(
          response.data.filter(
            (property) => property.sellerId !== Number(currentUser.id)
          )
        );
        setNoOfPages(Math.ceil(filteredProperties.length / propertiesOnPage));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSavedPropertiesIds = async () => {
      try {
        const savedResponse = await axios.get(
          `${baseURL}/saved-properties/${currentUser.id}`
        );

        const propertyIds: string[] = savedResponse.data.map(
          (obj: { propertyId: string }) => obj.propertyId
        );

        setSavedPropertiesIds(propertyIds);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };

    fetchProperties();

    if (currentUser.id != "-1") fetchSavedPropertiesIds();
  }, [currentUser]);

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
    <div className="bg-white">
      <div className="bg-[url('/homepage.jpg')] bg-cover bg-[center_top_13%] px-11 pt-32 pb-72 relative">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-8 mx-3">
            <h1 className="text-4xl font-bold text-stone-100 pt-10">
              Let's find not just a house but a home!
            </h1>

            <div className="relative max-w-[520px]">
              <input
                type="text"
                placeholder="Enter the name of a city, town or even village!"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 text-xl w-full rounded-lg h-10 pr-20 pl-3 hover:border-black transition"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white px-4 py-1 rounded-r-lg hover:bg-stone-100 transition"
              >
                <div className="w-5 h-5 bg-[url('/search_icon.png')] bg-contain bg-no-repeat bg-center"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-white p-5 bg-blue-600 text-4xl font-bold shadow-2 bg-opacity-80 absolute bottom-0 left-0 right-0">
          You may be interested in...
        </div>
      </div>

      {/* <input
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
          </select> */}

      {/* Seatch button */}

      <div className="px-4">
        <hr className="mb-10" />
        {/* Property Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5 bg-blue-100 border rounded-md">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              saved={savedPropertiesIds.includes(property.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex">
        <div></div>
        <label htmlFor="propsonpage">Properties on page: </label>
        <select name="propsonpage">
          <option value="24">24</option>
          <option value="32">32</option>
          <option value="48">48</option>
          <option value="72">72</option>
        </select>
      </div>
    </div>
  );
};

export default HomePage;
