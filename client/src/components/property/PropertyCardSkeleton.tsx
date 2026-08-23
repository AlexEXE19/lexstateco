const PropertyCardSkeleton: React.FC = () => (
  <div className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
    <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />

    <div className="flex items-start justify-between gap-2">
      <div className="h-5 w-2/3 rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
    </div>

    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <span
          key={idx}
          className="inline-flex h-6 w-20 items-center rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse"
        />
      ))}
    </div>

    <div className="h-4 w-32 rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />

    <div className="flex gap-3">
      <div className="h-10 flex-1 rounded-xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
      <div className="h-10 flex-1 rounded-xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
    </div>
  </div>
);

export default PropertyCardSkeleton;
