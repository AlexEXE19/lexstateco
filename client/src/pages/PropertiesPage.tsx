import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SlidersHorizontal, Search } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { RootState } from "../state/store";
import { useProperties } from "../hooks/useProperties";
import { Filter, Property } from "../types/types";

const PropertiesPage: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [proximity, setProximity] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const currentUser = useSelector((state: RootState) => state.user);

  const { filteredProperties, savedIds, applyFilters, loading } =
    useProperties(currentUser);

  const filters: Filter = useMemo(
    () => ({ location, minPrice, maxPrice, proximity }),
    [location, minPrice, maxPrice, proximity],
  );

  const onFilterSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    applyFilters(filters);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/80 px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 ring-1 ring-white/15 backdrop-blur">
              <SlidersHorizontal size={14} />
              <span>Filter smarter</span>
            </div>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Explore properties with clean, focused filters.
            </h1>
            <p className="max-w-2xl text-slate-200">
              Dial in by price, location, or proximity. No clutter—just listings
              ready to tour.
            </p>
          </div>

          <form
            onSubmit={onFilterSubmit}
            className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:grid-cols-2 lg:grid-cols-5"
          >
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Min price
              <input
                type="number"
                placeholder="e.g. 120000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Max price
              <input
                type="number"
                placeholder="e.g. 450000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Location
              <input
                type="text"
                placeholder="City or neighborhood"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Proximity
              <select
                value={proximity}
                onChange={(e) => setProximity(e.target.value)}
                className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option className="text-slate-900" value="">
                  Any
                </option>
                <option className="text-slate-900" value="City Center">
                  City Center
                </option>
                <option className="text-slate-900" value="Around the Center">
                  Around the Center
                </option>
                <option className="text-slate-900" value="Suburbs">
                  Suburbs
                </option>
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
              >
                <Search size={16} />
                Apply filters
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Results
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {filteredProperties.length} properties
              </h2>
            </div>
          </div>

          {selectedProperty ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.95fr_0.9fr]">
              <div className="space-y-4">
                <div className="text-sm text-slate-300">Browse more</div>
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

              <div className="space-y-4">
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Details
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-sm text-slate-200">
                    {selectedProperty.location}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
                    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                      <p className="text-xs uppercase text-slate-400">Price</p>
                      <p className="text-lg font-semibold text-white">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(selectedProperty.price)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                      <p className="text-xs uppercase text-slate-400">Size</p>
                      <p className="text-lg font-semibold text-white">
                        {selectedProperty.size} sq ft
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                      <p className="text-xs uppercase text-slate-400">
                        Distance
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {selectedProperty.distance}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                      <p className="text-xs uppercase text-slate-400">Seller</p>
                      <p className="text-lg font-semibold text-white">
                        ID {selectedProperty.sellerId}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-white/5 p-3 text-sm text-slate-200 ring-1 ring-white/10">
                    {selectedProperty.description}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-white/5 p-6 text-slate-200 ring-1 ring-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Map preview
                  </p>
                  <div className="mt-4 h-[420px] w-full rounded-2xl bg-slate-900/80 ring-1 ring-white/10">
                    {/* TODO: Embed Leaflet / OSM map here */}
                    <div className="flex h-full items-center justify-center text-slate-400">
                      Map container placeholder
                    </div>
                  </div>
                </div>
              </div>
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
                  No properties match your filters yet. Try widening your
                  search.
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
