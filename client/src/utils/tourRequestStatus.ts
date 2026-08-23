export const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-200 ring-amber-200/30",
  accepted: "bg-emerald-500/15 text-emerald-200 ring-emerald-200/30",
  rejected: "bg-rose-500/15 text-rose-200 ring-rose-200/30",
  canceled: "bg-slate-500/20 text-slate-200 ring-slate-200/30",
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
