import { useState } from "react";
import { Home, MapPin, Ruler, Tag, Upload } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PropertyListingFormFields,
  PropertyListingFormInput,
  propertyListingSchema,
} from "../../types/schemas/FormSchemas";
import { useCreatePropertyForm } from "../../hooks/property/useCreatePropertyForm";
import { useLocationSuggestions } from "../../hooks/property/useLocationSuggestions";
import { useTranslation } from "../../utils/i18n";
import StatusModal from "../property/StatusModal";

const PropertyListingForm: React.FC = () => {
  const { t } = useTranslation();
  const { files, setFiles, statusModal, closeStatusModal, submit } =
    useCreatePropertyForm();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyListingFormInput, any, PropertyListingFormFields>({
    resolver: zodResolver(propertyListingSchema),
  });

  const [suggestions, setSuggestions] = useState<any[]>();
  useLocationSuggestions(watch("location"), setSuggestions);

  const onSubmit: SubmitHandler<PropertyListingFormFields> = async (data) => {
    const success = await submit(data);
    if (success) {
      reset();
      setFiles([]);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("listing.label.title")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <Home size={16} className="text-primary-200" />
            <input
              {...register("title")}
              type="text"
              placeholder="Modern loft in downtown"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.title && (
            <p className="text-xs text-red-400">{errors.title.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("listing.label.price")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <Tag size={16} className="text-primary-200" />
            <input
              {...register("price")}
              type="number"
              placeholder="450000"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.price && (
            <p className="text-xs text-red-400">{errors.price.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("listing.label.location")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <MapPin size={16} className="text-primary-200" />
            <div>
              <input
                {...register("location")}
                type="text"
                placeholder="Austin, TX"
                className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                list="city-suggestions"
              />
              <datalist id="city-suggestions">
                {suggestions?.map((s, index) => (
                  <option key={index} value={s} />
                ))}
              </datalist>
            </div>
          </div>
          {errors.location && (
            <p className="text-xs text-red-400">{errors.location.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          {t("listing.label.description")}
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <textarea
              {...register("description")}
              placeholder="Describe the highlights, light, layout, and nearby spots."
              className="h-28 w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.description && (
            <p className="text-xs text-red-400">
              {errors.description.message}
            </p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("listing.label.neighborhood")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <MapPin size={16} className="text-primary-200" />
            <input
              {...register("neighborhood")}
              type="text"
              placeholder="East Austin"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.neighborhood && (
            <p className="text-xs text-red-400">
              {errors.neighborhood.message}
            </p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("listing.label.zip")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <Tag size={16} className="text-primary-200" />
            <input
              {...register("zipCode")}
              type="text"
              placeholder="73301"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.zipCode && (
            <p className="text-xs text-red-400">{errors.zipCode.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("listing.label.size")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <Ruler size={16} className="text-primary-200" />
            <input
              {...register("size")}
              type="number"
              placeholder="1800"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.size && (
            <p className="text-xs text-red-400">{errors.size.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          {t("listing.label.upload")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <Upload size={16} className="text-primary-200" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full text-white"
              onChange={(e) => {
                const incoming = Array.from(e.target.files || []);
                if (incoming.length > 8) {
                  alert("Please select up to 8 images.");
                  e.target.value = "";
                  return;
                }
                setFiles(incoming);
              }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Images will be stored under uploads/property/&lt;propertyId&gt;/
            on the server.
          </p>
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400 disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : t("listing.submit")}
          </button>
        </div>
      </form>

      {statusModal.open && (
        <StatusModal
          title={statusModal.title}
          body={statusModal.body}
          confirmLabel={
            statusModal.goToAccount ? "Go to my account" : "Close"
          }
          onClose={closeStatusModal}
        />
      )}
    </>
  );
};

export default PropertyListingForm;
