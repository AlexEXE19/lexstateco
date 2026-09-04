import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";

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
  const [filtersOpen, setFiltersOpen] = useState(true);

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
  };

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t("properties.filter.tag")}</p>
            <h1 className="mt-3 font-display text-display-sm text-ink">
              {t("nav.properties")}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-ink-muted">
              <span className="font-medium text-ink">
                {filteredProperties.length}
              </span>{" "}
              {t("properties.results")}
            </p>
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="btn-secondary py-2"
            >
              {filtersOpen ? <X size={15} /> : <SlidersHorizontal size={15} />}
              {t("properties.filter.toggle")}
            </button>
          </div>
        </header>

        {filtersOpen && (
          <div className="mt-8 space-y-5 border-y border-line py-6">
            <PropertyFilterForm
              onSubmit={handleFilterSubmit}
              presetLocation={curatedLocation}
            />
            <CuratedIdeas onExplore={handleExploreCurated} />
          </div>
        )}

        <div className="mt-10">
          {filteredProperties.length === 0 ? (
            <div className="border border-dashed border-line-strong px-6 py-20 text-center">
              <p className="text-sm text-ink-muted">{t("properties.empty")}</p>
            </div>
          ) : (
            <PropertyGrid
              properties={filteredProperties}
              isSaved={(propertyId) => savedIds?.has(propertyId) ?? false}
              onSelect={(property) => {
                dispatch(openPropertyModal(property));
                navigate(`/properties/${property.id}`);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
