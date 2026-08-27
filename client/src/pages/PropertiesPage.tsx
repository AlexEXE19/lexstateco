import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Map from "../components/common/Map";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFilterForm from "../components/property/PropertyFilterForm";
import MapPropertyCloud from "../components/property/MapPropertyCloud";
import CuratedIdeas from "../components/property/CuratedIdeas";
import { RootState } from "../state/store";
import { useProperties } from "../hooks/property/useProperties";
import { Filter, Property } from "../types/types";
import { useTranslation } from "../utils/i18n";

const PAGE_SIZE = 3;

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [showCloud, setShowCloud] = useState(false);
  const [curatedLocation, setCuratedLocation] = useState<string>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(0);

  const currentUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { filteredProperties, savedIds, applyFilters } =
    useProperties(currentUser);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  const pagedProperties = filteredProperties.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  // The map only ever shows one pin - by default, whichever property leads
  // the currently visible page - so browsing pages keeps the map relevant
  // to what's on screen.
  useEffect(() => {
    if (pagedProperties.length > 0) {
      setSelectedProperty(pagedProperties[0]);
      setShowCloud(true);
    } else {
      setSelectedProperty(null);
    }
    // Only the identity of "what's the first card on this page" should
    // retrigger this, not pagedProperties' array identity (a new array is
    // created on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagedProperties[0]?.id]);

  const resetToFirstPage = () => setPage(0);

  const handleFilterSubmit = (filters: Filter) => {
    applyFilters(filters);
    resetToFirstPage();
  };

  const handleExploreCurated = (location: string) => {
    applyFilters({ location, neighborhood: "", minPrice: "", maxPrice: "" });
    setCuratedLocation(location);
    resetToFirstPage();
    setFiltersOpen(false);
  };

  const handleSelectCard = (property: Property) => {
    setSelectedProperty(property);
    setShowCloud(true);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background text-white">
      <div className="relative z-[1100] shrink-0 border-b border-white/10 bg-background-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/10"
          >
            <SlidersHorizontal size={16} />
            {t("properties.filter.toggle")}
            <ChevronDown
              size={16}
              className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>
          <p className="text-sm text-slate-300">
            {filteredProperties.length} {t("properties.results")}
          </p>
        </div>

        {filtersOpen && (
          <div className="absolute inset-x-0 top-full max-h-[75vh] overflow-y-auto border-b border-white/10 bg-background-surface p-4 shadow-2xl">
            <div className="mx-auto max-w-6xl space-y-6">
              <PropertyFilterForm
                onSubmit={handleFilterSubmit}
                presetLocation={curatedLocation}
              />
              <CuratedIdeas onExplore={handleExploreCurated} />
            </div>
          </div>
        )}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-3">
        <div className="flex min-h-0 flex-col overflow-hidden border-b border-white/10 p-4 lg:col-span-1 lg:border-b-0 lg:border-r">
          {pagedProperties.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-200">
              {t("properties.empty")}
            </div>
          ) : (
            <div className="flex-1 space-y-3 overflow-hidden">
              {pagedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  saved={savedIds.includes(property.id)}
                  selected={selectedProperty?.id === property.id}
                  onSelect={handleSelectCard}
                />
              ))}
            </div>
          )}

          <div className="mt-3 flex shrink-0 items-center justify-between text-sm text-slate-200">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              {t("properties.pagination.prev")}
            </button>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {t("properties.pagination.page")} {page + 1}{" "}
              {t("properties.pagination.of")} {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-40"
            >
              {t("properties.pagination.next")}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 lg:col-span-2">
          <Map
            location={selectedProperty?.location}
            label={selectedProperty?.title}
          />
          {selectedProperty && showCloud && (
            <MapPropertyCloud
              property={selectedProperty}
              currentUser={currentUser}
              onClose={() => setShowCloud(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
