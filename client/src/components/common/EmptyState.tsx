import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Shared empty-state card for account-area tabs - optionally a clickable
// CTA (actionTo) when there's a next step to point at (e.g. browse
// properties), otherwise a plain informational card.
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}) => {
  const content = (
    <div className="flex flex-col items-center gap-3 border border-dashed border-line-strong px-6 py-16 text-center transition-colors group-hover:border-ink-subtle">
      <Icon size={22} className="text-ink-subtle" />
      <p className="text-sm text-ink">{title}</p>
      {description && (
        <p className="max-w-sm text-xs leading-relaxed text-ink-subtle">
          {description}
        </p>
      )}
      {actionLabel && (
        <span className="mt-1 inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-sm font-medium text-ink">
          {actionLabel}
          <ArrowRight size={14} />
        </span>
      )}
    </div>
  );

  return actionTo ? (
    <Link to={actionTo} className="group block cursor-pointer">
      {content}
    </Link>
  ) : (
    content
  );
};

export default EmptyState;
