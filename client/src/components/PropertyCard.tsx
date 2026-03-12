import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Home,
  MapPin,
  Phone,
  Ruler,
  Tag,
  Pencil,
  Trash2,
} from "lucide-react";
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
const PropertyCard: React.FC<{
  property: Property;
  saved: boolean;
  selected?: boolean;
  onSelect?: (property: Property) => void;
}> = ({ property, saved, selected = false, onSelect }) => {
  const dispatch = useDispatch();

  const [sellerName, setSellerName] = useState<string>("");
  const [sellerPhone, setSellerPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(saved);
  const [deleted, setDeleted] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.user);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen,
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
          `${baseURL}/users/${property.sellerId}`,
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

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleEditClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setPropertyIdToBeChanged(Number(property.id)));
    dispatch(setModalType("edit"));
    dispatch(toggleModal());
  };

  const priceLabel = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(property.price),
    [property.price],
  );

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
        Loading...
      </div>
    );
  }

  if (deleted) {
    return null;
  }

  return (
    <div
      onClick={() => onSelect?.(property)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl ${
        selected ? "ring-2 ring-blue-400/70" : "ring-1 ring-white/10"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src="/public/default_house.jpg"
          alt={property.title}
          className="h-44 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Home size={14} />
          <span>{property.size} sq ft</span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow">
          {priceLabel}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {property.title}
            </h2>
            <p className="text-sm text-slate-300 line-clamp-2">
              {property.description}
            </p>
          </div>
          <Bookmark
            size={18}
            className={`mt-1 transition ${
              isSaved
                ? "text-blue-300"
                : "text-slate-400 group-hover:text-white"
            }`}
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <MapPin size={12} /> {property.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Tag size={12} /> {property.distance}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Phone size={12} /> {sellerPhone || "—"}
          </span>
        </div>

        <div className="text-xs text-slate-300">
          Listed by {sellerName || "Agent"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {String(property.sellerId) === String(currentUser.id) ? (
          <>
            <button
              onClick={handleEditClick}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-[1px] hover:border-white/30 hover:bg-white/12"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/50 bg-white/5 px-4 py-2 text-sm font-semibold text-red-50 shadow-lg shadow-black/20 transition hover:-translate-y-[1px] hover:bg-red-500/20 hover:border-red-400"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={handleSaveClick}
            className="flex-1 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-[1px] hover:bg-blue-400"
          >
            {currentUser.id === "-1"
              ? "Register to save"
              : isSaved
                ? "Unsave"
                : "Save"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
