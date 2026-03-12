import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Home, MapPin, Ruler, Tag, Upload } from "lucide-react";
import { RootState } from "../state/store";
import baseURL from "../config/baseUrl";
import { useLocationSuggestions } from "../hooks/useLocationSuggestions";

// Tab for listing a property
const PropertyListingTab: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number | "">("");
  const [files, setFiles] = useState<File[]>([]);
  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    title: string;
    body: string;
    goToAccount: boolean;
  }>({ open: false, title: "", body: "", goToAccount: false });
  const userId = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>();
  const [suggestions, setSuggestions] = useState<any[]>();

  useLocationSuggestions(query, setSuggestions);

  const closeStatusModal = () => {
    setStatusModal((prev) => ({ ...prev, open: false }));
    if (statusModal.goToAccount) {
      navigate("/account");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      title,
      price: Number(price),
      location: locationInput,
      neighborhood,
      zipCode,
      description,
      size: Number(size),
      imageRefs: [],
      sellerId: userId,
    };

    if (files.length > 8) {
      setStatusModal({
        open: true,
        title: "Too many images",
        body: "You can upload up to 8 images per listing.",
        goToAccount: false,
      });
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/properties/`, propertyData);
      if (response.status === 201) {
        const newPropertyId = response.data.property.id;

        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => formData.append("images", file));
          await axios.post(
            `${baseURL}/properties/${newPropertyId}/images`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        }

        setTitle("");
        setPrice("");
        setLocationInput("");
        setNeighborhood("");
        setZipCode("");
        setDescription("");
        setSize("");
        setFiles([]);
        setStatusModal({
          open: true,
          title: "Listing published",
          body: "Your property is live. You can review or edit it from your account dashboard.",
          goToAccount: true,
        });
      }
    } catch (error) {
      console.error("Error listing the property:", error);
      setStatusModal({
        open: true,
        title: "Listing failed",
        body: "An error occurred while listing the property. Please try again.",
        goToAccount: false,
      });
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
            <div>
              {" "}
              <input
                type="text"
                placeholder="Austin, TX"
                className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                value={locationInput}
                list="city-suggestions"
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setQuery(e.target.value);
                }}
                required
              />
              <datalist id="city-suggestions">
                {suggestions?.map((s, index) => (
                  <option key={index} value={s} />
                ))}
              </datalist>
            </div>
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
          Neighborhood
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <MapPin size={16} className="text-blue-200" />
            <input
              type="text"
              placeholder="East Austin"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          ZIP code
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <Tag size={16} className="text-blue-200" />
            <input
              type="text"
              placeholder="73301"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
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

        <label className="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          Upload images (max 8)
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
            <Upload size={16} className="text-blue-200" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full text-white"
              onChange={(e) => {
                const incoming = Array.from(e.target.files || []);
                if (incoming.length > 8) {
                  alert("Please select up to 8 images.");
                  e.target.value = "";
                  return;
                }
                setFiles(incoming);
              }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Images will be stored under uploads/property/&lt;propertyId&gt;/ on
            the server.
          </p>
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

      {statusModal.open && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeStatusModal();
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Status
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              {statusModal.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{statusModal.body}</p>
            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={closeStatusModal}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-[1px] hover:bg-blue-500"
              >
                {statusModal.goToAccount ? "Go to my account" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListingTab;
