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
    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="w-full max-w-md rounded-lg border border-line bg-background-surface p-7 shadow-panel">
      <p className="eyebrow">Status</p>
      <h3 className="mt-2 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{body}</p>
      <div className="mt-6 flex items-center justify-end">
        <button
          onClick={onClose}
          className="btn-primary"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default StatusModal;
