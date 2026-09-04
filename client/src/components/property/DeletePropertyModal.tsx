import axios from "axios";
import baseURL from "../../config/baseUrl";
import { Loader2, Trash2, Sparkles } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Property } from "../../types/types";

interface DeletePropertyModalProps {
  property: Property;
  onCancel: () => void;
  onDeleted: () => void;
}

const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({
  property,
  onCancel,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/properties/${property.id}`);
      onDeleted();
    } catch (error) {
      console.error("Error deleting property: ", error);
      setLoading(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-line bg-background-surface shadow-panel">
        <div className="flex items-center gap-3 border-b border-line px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-rose-50 text-rose-600">
            <Trash2 size={20} />
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <div>
              <p className="eyebrow">
                Delete property
              </p>
              <h2 className="mt-1 font-display text-lg text-ink">
                This cannot be undone
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 text-ink-muted">
          <p>
            Are you sure you want to permanently remove "{property.title}"
            from your listings? Any associated images will remain on disk but
            the listing will disappear for everyone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Delete listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeletePropertyModal;
