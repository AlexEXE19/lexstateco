import type { LucideIcon } from "lucide-react";

// Shared header for every account-area tab (*Tab.tsx) - an icon tied to
// the same icon used for that tab in SidePanel, an eyebrow label, a title,
// and an optional description/action - so every tab opens with the same
// visual rhythm instead of each rolling its own heading markup.
interface TabHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const TabHeader: React.FC<TabHeaderProps> = ({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-1.5 shrink-0 text-primary-700" />
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 font-display text-2xl text-ink">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-ink-muted">{description}</p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default TabHeader;
