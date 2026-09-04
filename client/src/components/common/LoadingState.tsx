import { Loader2 } from "lucide-react";

// Shared loading placeholder for account-area tabs, so "fetching" looks the
// same everywhere instead of each tab using its own plain text box.
const LoadingState: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center justify-center gap-3 border border-line px-6 py-16 text-sm text-ink-muted">
    <Loader2 size={16} className="animate-spin text-primary-600" />
    {label}
  </div>
);

export default LoadingState;
