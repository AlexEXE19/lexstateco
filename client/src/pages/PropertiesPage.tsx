import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Map from "../components/common/Map";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFilterForm from "../components/property/PropertyFilterForm";
import MapPropertyCloud from "../components/property/MapPropertyCloud";
import CuratedIdeas from "../components/property/CuratedIdeas";
import { RootState } from "../state/store";
import { useProperties } from "../hooks/property/useProperties";
import { Filter, Property } from "../types/types";
import { useTranslation } from "../utils/i18n";

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [showCloud, setShowCloud] = useState(false);
  const [curatedLocation, setCuratedLocation] = useState<string>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { filteredProperties, savedIds, applyFilters } =
    useProperties(currentUser);

  // The map only ever shows one pin - by default, whichever property leads
  // the current results - so a fresh filter/search keeps the map relevant
  // to what's on screen instead of pointing at a stale selection.
  useEffect(() => {
    if (filteredProperties.length > 0) {
      setSelectedProperty(filteredProperties[0]);
      setShowCloud(true);
    } else {
      setSelectedProperty(null);
    }
    // Only the identity of "what's the first result now" should retrigger
    // this, not filteredProperties' array identity (a new array is created
    // on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProperties[0]?.id]);

  const handleFilterSubmit = (filters: Filter) => {
    applyFilters(filters);
  };

  const handleExploreCurated = (location: string) => {
    applyFilters({ location, neighborhood: "", minPrice: "", maxPrice: "" });
    setCuratedLocation(location);
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
        <div className="flex min-h-0 flex-col overflow-hidden border-b border-white/10 lg:col-span-1 lg:border-b-0 lg:border-r">
          {filteredProperties.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-4 text-center text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                {t("properties.empty")}
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {filteredProperties.map((property) => (
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
