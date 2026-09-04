const PropertyCardSkeleton: React.FC = () => (
  <div className="overflow-hidden rounded-lg border border-line bg-background-surface">
    <div className="aspect-[4/3] w-full animate-pulse bg-background-muted" />
    <div className="space-y-3 p-4">
      <div className="h-5 w-28 animate-pulse rounded bg-background-muted" />
      <div className="h-4 w-40 animate-pulse rounded bg-background-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-background-muted" />
    </div>
  </div>
);

export default PropertyCardSkeleton;
