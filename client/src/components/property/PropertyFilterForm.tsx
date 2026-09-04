import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  PropertyFilterFormFields,
  propertyFilterSchema,
} from "../../schemas/FormSchemas";
import { Filter } from "../../schemas/Filter";
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
    <form
      onSubmit={handleSubmit(submitFilters)}
      className="flex flex-wrap items-end gap-3"
    >
      <div className="min-w-[10rem] flex-1">
        <label className="field-label" htmlFor="filter-location">
          {t("properties.filter.location")}
        </label>
        <input
          id="filter-location"
          {...register("location")}
          type="text"
          placeholder={t("properties.filter.placeholder.location")}
          className="field"
        />
      </div>

      <div className="min-w-[10rem] flex-1">
        <label className="field-label" htmlFor="filter-neighborhood">
          {t("properties.filter.neighborhood")}
        </label>
        <input
          id="filter-neighborhood"
          {...register("neighborhood")}
          type="text"
          placeholder={t("properties.filter.placeholder.neighborhood")}
          className="field"
        />
      </div>

      <div className="w-32">
        <label className="field-label" htmlFor="filter-min">
          {t("properties.filter.min")}
        </label>
        <input
          id="filter-min"
          {...register("minPrice")}
          type="number"
          placeholder={t("properties.filter.placeholder.min")}
          className="field"
        />
        {errors.minPrice && (
          <p className="mt-1 text-xs text-rose-600">{errors.minPrice.message}</p>
        )}
      </div>

      <div className="w-32">
        <label className="field-label" htmlFor="filter-max">
          {t("properties.filter.max")}
        </label>
        <input
          id="filter-max"
          {...register("maxPrice")}
          type="number"
          placeholder={t("properties.filter.placeholder.max")}
          className="field"
        />
        {errors.maxPrice && (
          <p className="mt-1 text-xs text-rose-600">{errors.maxPrice.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        <Search size={15} />
        {t("properties.filter.apply")}
      </button>
    </form>
  );
};

export default PropertyFilterForm;
