import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Filter } from "../../types/types";
import { useTranslation } from "../../utils/i18n";

interface PropertyFilterFormProps {
  onSubmit: (filters: Filter) => void;
}

const PropertyFilterForm: React.FC<PropertyFilterFormProps> = ({
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ location, minPrice, maxPrice, neighborhood });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 ring-1 ring-white/15 backdrop-blur">
          <SlidersHorizontal size={14} />
          <span>{t("properties.filter.tag")}</span>
        </div>
        <h1 className="text-3xl font-semibold md:text-4xl">
          {t("properties.filter.heading")}
        </h1>
        <p className="max-w-2xl text-slate-200">
          {t("properties.filter.sub")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:grid-cols-2 lg:grid-cols-5"
      >
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.min")}
          <input
            type="number"
            placeholder={t("properties.filter.placeholder.min")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.max")}
          <input
            type="number"
            placeholder={t("properties.filter.placeholder.max")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.location")}
          <input
            type="text"
            placeholder={t("properties.filter.placeholder.location")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.neighborhood")}
          <input
            type="text"
            placeholder={t("properties.filter.placeholder.neighborhood")}
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400"
          >
            <Search size={16} />
            {t("properties.filter.apply")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilterForm;
