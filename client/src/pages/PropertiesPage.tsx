import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import PropertyFilterForm from "../components/property/PropertyFilterForm";
import CuratedIdeas from "../components/property/CuratedIdeas";
import PropertyGrid from "../components/property/PropertyGrid";

import { RootState } from "../state/store";
import { openPropertyModal } from "../state/propertyModal/propertyModalSlice";
import { useProperties } from "../hooks/property/useProperties";
import { Filter } from "../schemas/Filter";
import { useTranslation } from "../utils/i18n";

const PropertiesPage: React.FC = () => {
  const [curatedLocation, setCuratedLocation] = useState<string>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { filteredProperties, savedIds, applyFilters } =
    useProperties(currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFilterSubmit = (filters: Filter) => {
    applyFilters(filters);
  };

  const handleExploreCurated = (location: string) => {
    applyFilters({ location, neighborhood: "", minPrice: "", maxPrice: "" });
    setCuratedLocation(location);
    setFiltersOpen(false);
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-background text-white">
      {/*Filters section */}
      <div className="relative  shrink-0 border-b border-white/10 bg-background-surface/80 backdrop-blur">
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
      <PropertyGrid
        properties={filteredProperties}
        isSaved={(propertyId) => savedIds?.has(propertyId) ?? false}
        onSelect={(property) => {
          dispatch(openPropertyModal(property));
          navigate(`/properties/${property.id}`);
        }}
      />
    </div>
  );
};

export default PropertiesPage;
