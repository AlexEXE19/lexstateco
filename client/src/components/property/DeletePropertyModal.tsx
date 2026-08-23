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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-surface/40 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-white via-rose-50 to-amber-50 shadow-2xl ring-1 ring-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-200/70 px-6 py-4 bg-white/70 backdrop-blur">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <Trash2 size={20} />
          </div>
          <div className="flex items-center gap-2 text-rose-800">
            <Sparkles size={16} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-700">
                Delete property
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                This cannot be undone
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 text-slate-700">
          <p>
            Are you sure you want to permanently remove "{property.title}"
            from your listings? Any associated images will remain on disk but
            the listing will disappear for everyone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-400/40 transition hover:-translate-y-[1px] hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
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
