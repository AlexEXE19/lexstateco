interface StatusModalProps {
  title: string;
  body: string;
  confirmLabel: string;
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  title,
  body,
  confirmLabel,
  onClose,
}) => (
  <div
    className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-8"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
        Status
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
      <div className="mt-6 flex items-center justify-end">
        <button
          onClick={onClose}
          className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:-translate-y-[1px] hover:bg-primary-500"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default StatusModal;
