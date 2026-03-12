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
  ChevronLeft,
  ChevronRight,
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
  const [activeImage, setActiveImage] = useState<number>(0);
  const currentUser = useSelector((state: RootState) => state.user);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen,
  );

  const navigate = useNavigate();

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  useEffect(() => {
    setActiveImage(0);
  }, [property.id]);

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
        await axios.post(`${baseURL}/saved-properties`, {
          userId: currentUser.id,
          propertyId: property.id,
        });
      } else {
        await axios.delete(`${baseURL}/saved-properties`, {
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

  const imageCount = property.imageRefs?.length || 0;
  const base = baseURL.replace(/\/$/, "");
  const currentImage =
    imageCount > 0
      ? `${base}/${property.imageRefs[activeImage % imageCount]}`
      : "/default_house.jpg";

  const nextImage = (delta: number) => {
    if (imageCount === 0) return;
    setActiveImage((idx) => (idx + delta + imageCount) % imageCount);
  };

  if (loading) {
    return (
      <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"></div>
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
          src={currentImage}
          alt={property.title}
          className="h-44 w-full object-cover"
        />
        {imageCount > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white shadow"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white shadow"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Home size={14} />
          <span>{property.size} sq ft</span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow">
          {priceLabel}
        </div>
        {imageCount > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {property.imageRefs?.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(idx);
                }}
                className={`h-2 w-2 rounded-full ${
                  idx === activeImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {property.title}
            </h2>
          </div>
          {String(property.sellerId) !== String(currentUser.id) && (
            <button
              onClick={handleSaveClick}
              className="rounded-full p-1 transition hover:bg-white/10"
              aria-label={isSaved ? "Unsave property" : "Save property"}
            >
              <Bookmark
                size={18}
                className={`transition ${
                  isSaved
                    ? "text-sky-300 drop-shadow"
                    : "text-slate-300 group-hover:text-white"
                }`}
              />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <MapPin size={12} /> {property.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Tag size={12} /> {property.neighborhood}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Tag size={12} /> {property.zipCode}
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
        {String(property.sellerId) === String(currentUser.id) && (
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
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
