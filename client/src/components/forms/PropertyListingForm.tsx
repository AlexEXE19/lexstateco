import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BedDouble,
  Bath,
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  MapPin,
  Ruler,
  Sparkles,
  Tag,
  Upload,
} from "lucide-react";

import MapModal from "../modals/MapModal";
import StatusModal from "../property/StatusModal";
import { Coords } from "../common/Map";

import {
  AMENITY_VALUES,
  PROPERTY_STATUS_VALUES,
  PROPERTY_TYPE_VALUES,
  PropertyListingFormFields,
  PropertyListingFormInput,
  propertyListingSchema,
} from "../../schemas/FormSchemas";
import { useCreatePropertyForm } from "../../hooks/property/useCreatePropertyForm";
import { useLocationSuggestions } from "../../hooks/property/useLocationSuggestions";
import { buildQuery } from "../../utils/buildQuery";
import { FALLBACK_COORDS, getUserLocation } from "../../utils/getUserLocation";
import { useTranslation } from "../../utils/i18n";

// "swimmingPool" -> "Swimming Pool" - lets the enum value lists double as
// display labels instead of maintaining a parallel label map.
const humanizeEnumValue = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

type StepFieldName = Path<PropertyListingFormInput>;

// Checkpoints, each a subset of propertyListingSchema's fields. Keeping
// these (and the field lists used to validate a checkpoint before moving
// on) in this file rather than splitting into more components, since the
// whole form is short enough to stay readable as one file.
const STEPS: { key: string; labelKey: string; fields: StepFieldName[] }[] = [
  {
    key: "location",
    labelKey: "listing.step.location",
    fields: [
      "location.country",
      "location.city",
      "location.neighborhood",
      "location.address",
      "location.zipCode",
    ],
  },
  {
    key: "details",
    labelKey: "listing.step.details",
    fields: [
      "price",
      "size",
      "bedrooms",
      "bathrooms",
      "type",
      "status",
      "description",
    ],
  },
  {
    key: "amenities",
    labelKey: "listing.step.amenities",
    fields: ["amenities"],
  },
];

const PropertyListingForm: React.FC = () => {
  const { t } = useTranslation();

  // Local UI state
  const [step, setStep] = useState(0);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [pinCoords, setPinCoords] = useState<Coords>();
  const [address, setAddress] = useState<any>();
  const [citySuggestions, setCitySuggestions] = useState<any[]>();
  const [countrySuggestions, setCountrySuggestions] = useState<any[]>();

  // Form + submission wiring
  const { setFiles, statusModal, closeStatusModal, submit } =
    useCreatePropertyForm();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyListingFormInput, any, PropertyListingFormFields>({
    resolver: zodResolver(propertyListingSchema),
    defaultValues: { status: "available", amenities: [] },
  });

  const isLastStep = step === STEPS.length - 1;

  const watchedCountry = watch("location.country");
  const watchedCity = watch("location.city");
  const citySuggestionsToggle = (watchedCity || "").length > 0;
  const countrySuggestionsToggle = (watchedCountry || "").length > 0;
  const cityQuery = buildQuery({ q: watchedCity, featuretype: "settlement" });
  const countryQuery = buildQuery({ q: watchedCountry });

  useLocationSuggestions(cityQuery, setCitySuggestions, citySuggestionsToggle);
  useLocationSuggestions(
    countryQuery,
    setCountrySuggestions,
    countrySuggestionsToggle,
  );

  useEffect(() => {
    if (address) {
      setValue("location.country", address.country, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("location.city", address.city, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("location.neighborhood", address.neighborhood, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("location.zipCode", address.zipcode, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("location.address", address.address, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isMapModalOpen]);

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit: SubmitHandler<PropertyListingFormFields> = async (data) => {
    const success = await submit(data);
    if (success) {
      reset();
      setFiles([]);
      setStep(0);
    }
  };

  // A single handler for the primary button, kept as type="button" on every
  // step (including the last) rather than conditionally switching to
  // type="submit". Letting the browser's native submit-on-click kick in
  // once isLastStep flips true is a race: goNext is async, and by the time
  // the click's default-action phase runs, React may have already
  // re-rendered the button to type="submit", submitting the form on what
  // was meant to be the transition into the last step.
  const handlePrimaryAction = async () => {
    if (!isLastStep) {
      const valid = await trigger(STEPS[step].fields);
      if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
      return;
    }
    await handleSubmit(onSubmit)();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur"
      >
        {/* Step indicator */}
        <div className="mb-2 flex items-center gap-2">
          {STEPS.map((s, idx) => (
            <div key={s.key} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  idx === step
                    ? "bg-primary-500 text-white"
                    : idx < step
                      ? "bg-primary-500/40 text-white"
                      : "bg-white/10 text-slate-300"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  idx === step ? "text-white" : "text-slate-400"
                }`}
              >
                {t(s.labelKey)}
              </span>
              {idx < STEPS.length - 1 && (
                <div className="h-px flex-1 bg-white/10" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          {t("listing.step.label")} {step + 1} / {STEPS.length}
        </p>

        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.country")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <Globe2 size={16} className="text-primary-200" />
                <div className="relative">
                  <input
                    {...register("location.country")}
                    type="text"
                    placeholder="United States"
                    className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                    autoComplete="off"
                    onBlur={() => {
                      setTimeout(() => setCountrySuggestions([]), 200);
                    }}
                  />
                  {countrySuggestions &&
                    countrySuggestions &&
                    countrySuggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-y-auto rounded-xl bg-slate-900/95 border border-white/10 shadow-xl backdrop-blur divide-y divide-white/5">
                        {countrySuggestions.map((s, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setValue("location.country", s.country, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setCountrySuggestions([]);
                            }}
                            className="px-4 py-3 cursor-pointer text-left transition-colors hover:bg-white/10"
                          >
                            <div className="font-semibold text-white">
                              {s.country}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
              {errors.location?.country && (
                <p className="text-xs text-red-400">
                  {errors.location.country.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.city")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <MapPin size={16} className="text-primary-200" />
                <div className="relative w-full ">
                  <input
                    {...register("location.city")}
                    type="text"
                    placeholder="Austin"
                    className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                    list="city-suggestions"
                    autoComplete="off"
                    onBlur={() => {
                      setTimeout(() => setCitySuggestions([]), 200);
                    }}
                  />
                  {citySuggestionsToggle &&
                    citySuggestions &&
                    citySuggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-y-auto rounded-xl bg-slate-900/95 border border-white/10 shadow-xl backdrop-blur divide-y divide-white/5">
                        {citySuggestions.map((s, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setValue("location.city", s.city, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setCitySuggestions([]);
                            }}
                            className="px-4 py-3 cursor-pointer text-left transition-colors hover:bg-white/10"
                          >
                            <div className="font-semibold text-white">
                              {s.city}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 truncate">
                              {[s.city, s.county, s.country]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
              {errors.location?.city && (
                <p className="text-xs text-red-400">
                  {errors.location.city.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.neighborhood")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <MapPin size={16} className="text-primary-200" />
                <input
                  {...register("location.neighborhood")}
                  type="text"
                  placeholder="East Austin"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {errors.location?.neighborhood && (
                <p className="text-xs text-red-400">
                  {errors.location.neighborhood.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.address")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <MapPin size={16} className="text-primary-200" />
                <input
                  {...register("location.address")}
                  type="text"
                  placeholder="123 Main St"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {errors.location?.address && (
                <p className="text-xs text-red-400">
                  {errors.location.address.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.zip")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <Tag size={16} className="text-primary-200" />
                <input
                  {...register("location.zipCode")}
                  type="text"
                  placeholder="73301"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {errors.location?.zipCode && (
                <p className="text-xs text-red-400">
                  {errors.location.zipCode.message}
                </p>
              )}
            </label>

            {/* Map for pinpointing the location, a placeholder or the map modal is rendered depending on a boolean state */}
            {isMapModalOpen ? (
              <MapModal
                coords={pinCoords || FALLBACK_COORDS}
                setAddress={setAddress}
                onClose={() => {
                  setIsMapModalOpen(false);
                }}
              ></MapModal>
            ) : (
              <div
                onClick={async () => {
                  const coords = await getUserLocation();
                  setPinCoords(coords);
                  setIsMapModalOpen(true);
                }}
                className="border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 cursor-pointer rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all group h-full min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Pin exact location on map
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Click to open map and drop a pin
                </p>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
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

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.bedrooms")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <BedDouble size={16} className="text-primary-200" />
                <input
                  {...register("bedrooms")}
                  type="number"
                  placeholder="3"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {errors.bedrooms && (
                <p className="text-xs text-red-400">
                  {errors.bedrooms.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.bathrooms")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <Bath size={16} className="text-primary-200" />
                <input
                  {...register("bathrooms")}
                  type="number"
                  placeholder="2"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {errors.bathrooms && (
                <p className="text-xs text-red-400">
                  {errors.bathrooms.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.type")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <Building2 size={16} className="text-primary-200" />
                <select
                  {...register("type")}
                  defaultValue=""
                  className="w-full bg-transparent text-white focus:outline-none [&>option]:bg-background-surface"
                >
                  <option value="" disabled>
                    {t("listing.label.type")}
                  </option>
                  {PROPERTY_TYPE_VALUES.map((value) => (
                    <option key={value} value={value}>
                      {humanizeEnumValue(value)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.type && (
                <p className="text-xs text-red-400">{errors.type.message}</p>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.status")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <Sparkles size={16} className="text-primary-200" />
                <select
                  {...register("status")}
                  className="w-full bg-transparent text-white focus:outline-none [&>option]:bg-background-surface"
                >
                  {PROPERTY_STATUS_VALUES.map((value) => (
                    <option key={value} value={value}>
                      {humanizeEnumValue(value)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.status && (
                <p className="text-xs text-red-400">{errors.status.message}</p>
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
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <div className="flex flex-col gap-2 text-sm text-slate-200">
              {t("listing.label.amenities")}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITY_VALUES.map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    <input
                      {...register("amenities")}
                      type="checkbox"
                      value={value}
                      className="accent-primary-500"
                    />
                    {humanizeEnumValue(value)}
                  </label>
                ))}
              </div>
              {errors.amenities && (
                <p className="text-xs text-red-400">
                  {errors.amenities.message as string}
                </p>
              )}
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
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
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            {t("listing.step.back")}
          </button>

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400 disabled:opacity-50"
          >
            {isLastStep ? (
              isSubmitting ? (
                "Publishing..."
              ) : (
                t("listing.submit")
              )
            ) : (
              <>
                {t("listing.step.next")}
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {statusModal.open && (
        <StatusModal
          title={statusModal.title}
          body={statusModal.body}
          confirmLabel={statusModal.goToAccount ? "Go to my account" : "Close"}
          onClose={closeStatusModal}
        />
      )}
    </>
  );
};

export default PropertyListingForm;
