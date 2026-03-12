import { toggleModal } from "../state/modal/modalSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import baseURL from "../config/baseUrl";
import { RootState } from "../state/store";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Property } from "../types/types";
import { X, Loader2, Sparkles } from "lucide-react";

const EditPropertyModal: React.FC = () => {
  const dispatch = useDispatch();

  const propertyIdToBeChanged = useSelector(
    (state: RootState) => state.modal.propertyIdToBeChanged,
  );

  const [property, setProperty] = useState<Property | null>(null);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number | "">("");
  const [imageRefsInput, setImageRefsInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const parsedImageRefs = useMemo(
    () =>
      imageRefsInput
        .split(",")
        .map((ref) => ref.trim())
        .filter(Boolean),
    [imageRefsInput],
  );

  useEffect(() => {
    if (propertyIdToBeChanged === -1) return;

    const getPropertyInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}/properties/${propertyIdToBeChanged}`,
        );
        const data = response.data;
        setProperty(data);
        setTitle(data.title || "");
        setPrice(data.price ?? "");
        setLocation(data.location || "");
        setNeighborhood(data.neighborhood || "");
        setZipCode(data.zipCode || "");
        setDescription(data.description || "");
        setSize(data.size ?? "");
        setImageRefsInput((data.imageRefs || []).join(", "));
      } catch (error) {
        console.error("Error getting property by its id: ", error);
      } finally {
        setLoading(false);
      }
    };

    getPropertyInfo();
  }, [propertyIdToBeChanged]);

  const handleClose = () => {
    dispatch(toggleModal());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (propertyIdToBeChanged === -1) return;

    setSaving(true);
    try {
      await axios.put(`${baseURL}/properties/${propertyIdToBeChanged}/`, {
        title,
        price: Number(price),
        location,
        neighborhood,
        zipCode,
        description,
        size: Number(size),
        imageRefs: parsedImageRefs,
      });
      handleClose();
    } catch (error) {
      console.error("Error updating property: ", error);
    } finally {
      setSaving(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50 to-blue-50 shadow-2xl ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4 bg-white/70 backdrop-blur">
          <div className="flex items-center gap-2 text-sky-800">
            <Sparkles size={16} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-700">
                Edit property
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                {property?.title || "Update details"}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 size={18} className="animate-spin" />
              Loading property details...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Price (USD)
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || "")}
                  className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Location
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Neighborhood
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                ZIP code
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Size (sq ft)
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value) || "")}
                  className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  required
                />
              </label>

              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-700">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  required
                />
              </label>

              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-700">
                Image references (comma-separated)
                <textarea
                  value={imageRefsInput}
                  onChange={(e) => setImageRefsInput(e.target.value)}
                  className="min-h-[80px] rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  placeholder="uploads/property/123/1699990000-front.jpg, uploads/property/123/1699990001-living.jpg"
                />
                <p className="text-xs text-slate-500">
                  Existing images stay unless you remove them here. Maximum 8
                  paths are saved.
                </p>
              </label>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-400/40 transition hover:-translate-y-[1px] hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={saving}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Save changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditPropertyModal;
