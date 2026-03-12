import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Home, MapPin, Ruler, Tag } from "lucide-react";
import { RootState } from "../state/store";
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
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
          List a property
        </p>
        <h2 className="text-3xl font-semibold">Showcase your home</h2>
        <p className="text-sm text-slate-300">
          Add the essentials so buyers can discover and tour quickly.
        </p>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Title
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <Home size={16} className="text-blue-200" />
            <input
              type="text"
              placeholder="Modern loft in downtown"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Price (USD)
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <Tag size={16} className="text-blue-200" />
            <input
              type="number"
              placeholder="450000"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || "")}
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Location
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <MapPin size={16} className="text-blue-200" />
            <input
              type="text"
              placeholder="Austin, TX"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          Description
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <textarea
              placeholder="Describe the highlights, light, layout, and nearby spots."
              className="h-28 w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Size (sq ft)
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <Ruler size={16} className="text-blue-200" />
            <input
              type="number"
              placeholder="1800"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
              value={size}
              onChange={(e) => setSize(Number(e.target.value) || "")}
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Distance to center (km)
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <MapPin size={16} className="text-blue-200" />
            <input
              type="number"
              placeholder="5"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value) || "")}
              required
            />
          </div>
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
          >
            List property
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyListingTab;
