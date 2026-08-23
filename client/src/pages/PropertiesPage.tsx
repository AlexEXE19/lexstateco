import { useState } from "react";
import { useSelector } from "react-redux";
import Map from "../components/common/Map";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFilterForm from "../components/property/PropertyFilterForm";
import PropertyDetailPanel from "../components/property/PropertyDetailPanel";
import { RootState } from "../state/store";
import { useProperties } from "../hooks/property/useProperties";
import { Filter, Property } from "../types/types";
import { useTranslation } from "../utils/i18n";

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const currentUser = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { filteredProperties, savedIds, applyFilters } =
    useProperties(currentUser);

  const handleFilterSubmit = (filters: Filter) => {
    applyFilters(filters);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <section className="bg-gradient-to-br from-background via-background-surface to-primary-900/80 px-6 py-14">
        <PropertyFilterForm onSubmit={handleFilterSubmit} />
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {t("properties.resultsLabel")}
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {filteredProperties.length} {t("properties.results")}
              </h2>
            </div>
          </div>

          {selectedProperty ? (
            <div className="grid gap-6 lg:h-[75vh] lg:grid-cols-2 lg:overflow-hidden">
              <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-rows-[1fr_1fr]">
                <div className="rounded-3xl bg-white/5 p-6 text-slate-200 ring-1 ring-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {t("properties.map")}
                  </p>
                  <div className="mt-4 h-[240px] w-full rounded-2xl bg-background-surface/80 ring-1 ring-white/10 lg:h-full">
                    <div
                      id="map"
                      className="flex h-full items-center justify-center text-slate-400"
                    >
                      <Map
                        location={selectedProperty?.location}
                        label={`${selectedProperty?.title || "Property"} • ${selectedProperty?.location || ""}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
                  <div className="text-sm text-slate-300">
                    {t("properties.browse")}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        saved={savedIds.includes(property.id)}
                        selected={selectedProperty?.id === property.id}
                        onSelect={setSelectedProperty}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <PropertyDetailPanel
                property={selectedProperty}
                currentUser={currentUser}
                onClose={() => setSelectedProperty(null)}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    saved={savedIds.includes(property.id)}
                    onSelect={setSelectedProperty}
                  />
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-200">
                  {t("properties.empty")}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;
