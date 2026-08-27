import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PropertyFilterFormFields,
  propertyFilterSchema,
} from "../../types/schemas/FormSchemas";
import { Filter } from "../../types/types";
import { useTranslation } from "../../utils/i18n";

interface PropertyFilterFormProps {
  onSubmit: (filters: Filter) => void;
  // Set when a "Curated for today" pick is clicked, so the location input
  // visibly reflects what CuratedIdeas already asked PropertiesPage to
  // filter by, instead of the results changing under an unchanged form.
  presetLocation?: string;
}

const PropertyFilterForm: React.FC<PropertyFilterFormProps> = ({
  onSubmit,
  presetLocation,
}) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // HomeHero's search box lands here as /properties?location=..., so the
  // form (and the results underneath it) should start already reflecting
  // whatever the visitor searched for on the home page, not an empty form
  // they then have to resubmit.
  const initialValues: PropertyFilterFormFields = {
    location: searchParams.get("location") ?? "",
    neighborhood: searchParams.get("neighborhood") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFilterFormFields>({
    resolver: zodResolver(propertyFilterSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (presetLocation) {
      setValue("location", presetLocation);
    }
  }, [presetLocation, setValue]);

  const submitFilters: SubmitHandler<PropertyFilterFormFields> = async (
    data,
  ) => {
    onSubmit({
      location: data.location ?? "",
      neighborhood: data.neighborhood ?? "",
      minPrice: data.minPrice ?? "",
      maxPrice: data.maxPrice ?? "",
    });
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
        onSubmit={handleSubmit(submitFilters)}
        className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:grid-cols-2 lg:grid-cols-5"
      >
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.min")}
          <input
            {...register("minPrice")}
            type="number"
            placeholder={t("properties.filter.placeholder.min")}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          {errors.minPrice && (
            <p className="text-xs text-red-400">{errors.minPrice.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.max")}
          <input
            {...register("maxPrice")}
            type="number"
            placeholder={t("properties.filter.placeholder.max")}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          {errors.maxPrice && (
            <p className="text-xs text-red-400">{errors.maxPrice.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.location")}
          <input
            {...register("location")}
            type="text"
            placeholder={t("properties.filter.placeholder.location")}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("properties.filter.neighborhood")}
          <input
            {...register("neighborhood")}
            type="text"
            placeholder={t("properties.filter.placeholder.neighborhood")}
            className="rounded-2xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400 disabled:opacity-50"
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
