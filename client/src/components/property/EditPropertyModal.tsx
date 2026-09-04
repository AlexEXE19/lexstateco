import axios from "axios";
import baseURL from "../../config/baseUrl";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Property } from "../../types/types";
import { X, Loader2, Sparkles } from "lucide-react";
import ModalFormField from "./ModalFormField";

interface EditPropertyModalProps {
  property: Property;
  onCancel: () => void;
  onSaved: () => void;
}

// Receives the property directly from PropertyCard (which already has it
// loaded) instead of re-fetching it by id from the server.
const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  property,
  onCancel,
  onSaved,
}) => {
  const [title, setTitle] = useState(property.title);
  const [price, setPrice] = useState<number | "">(property.price);
  const [location, setLocation] = useState(property.location);
  const [neighborhood, setNeighborhood] = useState(property.neighborhood);
  const [zipCode, setZipCode] = useState(property.zipCode);
  const [description, setDescription] = useState(property.description);
  const [size, setSize] = useState<number | "">(property.size);
  const [imageRefsInput, setImageRefsInput] = useState(
    (property.imageRefs || []).join(", "),
  );
  const [saving, setSaving] = useState(false);

  const parsedImageRefs = useMemo(
    () =>
      imageRefsInput
        .split(",")
        .map((ref) => ref.trim())
        .filter(Boolean),
    [imageRefsInput],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    try {
      await axios.put(`${baseURL}/properties/${property.id}/`, {
        title,
        price: Number(price),
        location,
        neighborhood,
        zipCode,
        description,
        size: Number(size),
        imageRefs: parsedImageRefs,
      });
      onSaved();
    } catch (error) {
      console.error("Error updating property: ", error);
    } finally {
      setSaving(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-lg border border-line bg-background-surface shadow-panel">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <div>
              <p className="eyebrow">
                Edit property
              </p>
              <h2 className="mt-1 font-display text-xl text-ink">
                {property.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-subtle transition-colors hover:bg-background-elevated hover:text-ink"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <ModalFormField
              label="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <ModalFormField
              label="Price (USD)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || "")}
              required
            />

            <ModalFormField
              label="Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <ModalFormField
              label="Neighborhood"
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
            />

            <ModalFormField
              label="ZIP code"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />

            <ModalFormField
              label="Size (sq ft)"
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value) || "")}
              required
            />

            <label className="md:col-span-2">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="field min-h-[120px] resize-none"
                required
              />
            </label>

            <label className="md:col-span-2">
              Image references (comma-separated)
              <textarea
                value={imageRefsInput}
                onChange={(e) => setImageRefsInput(e.target.value)}
                className="field min-h-[80px] resize-none"
                placeholder="uploads/property/123/1699990000-front.jpg, uploads/property/123/1699990001-living.jpg"
              />
              <p className="mt-1.5 text-xs text-ink-subtle">
                Existing images stay unless you remove them here. Maximum 8
                paths are saved.
              </p>
            </label>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditPropertyModal;
