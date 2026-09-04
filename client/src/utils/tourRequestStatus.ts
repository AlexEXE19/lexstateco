export const statusColors: Record<string, string> = {
  pending: "bg-secondary-50 text-secondary-700 border-secondary-200",
  accepted: "bg-primary-50 text-primary-800 border-primary-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  canceled: "bg-background-elevated text-ink-muted border-line-strong",
};

export const formatDateTime = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? value
    : `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
};
