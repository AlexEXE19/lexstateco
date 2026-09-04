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
import { humanizeEnumValue } from "../../utils/humanize";
import { useTranslation } from "../../utils/i18n";

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
        className="grid gap-6 border border-line bg-background-surface p-7"
      >
        {/* Step indicator */}
        <div className="flex items-center gap-3 border-b border-line pb-6">
          {STEPS.map((s, idx) => (
            <div key={s.key} className="flex flex-1 items-center gap-3">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs transition-colors ${
                  idx === step
                    ? "bg-primary-800 text-white"
                    : idx < step
                      ? "bg-primary-100 text-primary-800"
                      : "border border-line text-ink-subtle"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`hidden whitespace-nowrap text-xs sm:block ${
                  idx === step ? "font-medium text-ink" : "text-ink-subtle"
                }`}
              >
                {t(s.labelKey)}
              </span>
              {idx < STEPS.length - 1 && (
                <div className="h-px flex-1 bg-line" />
              )}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.country")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Globe2 size={16} className="shrink-0 text-ink-subtle" />
                <div className="relative">
                  <input
                    {...register("location.country")}
                    type="text"
                    placeholder="United States"
                    className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                    autoComplete="off"
                    onBlur={() => {
                      setTimeout(() => setCountrySuggestions([]), 200);
                    }}
                  />
                  {countrySuggestions &&
                    countrySuggestions &&
                    countrySuggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 divide-y divide-line overflow-y-auto rounded-md border border-line bg-background-surface shadow-panel">
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
                            className="cursor-pointer px-4 py-2.5 text-left transition-colors hover:bg-background-elevated"
                          >
                            <div className="text-sm text-ink">
                              {s.country}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
              {errors.location?.country && (
                <p className="text-xs text-rose-600">
                  {errors.location.country.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.city")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <MapPin size={16} className="shrink-0 text-ink-subtle" />
                <div className="relative w-full ">
                  <input
                    {...register("location.city")}
                    type="text"
                    placeholder="Austin"
                    className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                    list="city-suggestions"
                    autoComplete="off"
                    onBlur={() => {
                      setTimeout(() => setCitySuggestions([]), 200);
                    }}
                  />
                  {citySuggestionsToggle &&
                    citySuggestions &&
                    citySuggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 divide-y divide-line overflow-y-auto rounded-md border border-line bg-background-surface shadow-panel">
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
                            className="cursor-pointer px-4 py-2.5 text-left transition-colors hover:bg-background-elevated"
                          >
                            <div className="text-sm text-ink">
                              {s.city}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-ink-subtle">
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
                <p className="text-xs text-rose-600">
                  {errors.location.city.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.neighborhood")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <MapPin size={16} className="shrink-0 text-ink-subtle" />
                <input
                  {...register("location.neighborhood")}
                  type="text"
                  placeholder="East Austin"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.location?.neighborhood && (
                <p className="text-xs text-rose-600">
                  {errors.location.neighborhood.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.address")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <MapPin size={16} className="shrink-0 text-ink-subtle" />
                <input
                  {...register("location.address")}
                  type="text"
                  placeholder="123 Main St"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.location?.address && (
                <p className="text-xs text-rose-600">
                  {errors.location.address.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.zip")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Tag size={16} className="shrink-0 text-ink-subtle" />
                <input
                  {...register("location.zipCode")}
                  type="text"
                  placeholder="73301"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.location?.zipCode && (
                <p className="text-xs text-rose-600">
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
                className="group flex h-full min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-line-strong p-6 text-center transition-colors hover:border-ink-subtle hover:bg-background-elevated"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-700">
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
                <p className="text-sm font-medium text-ink">
                  Pin exact location on map
                </p>
                <p className="mt-1 text-xs text-ink-subtle">
                  Click to open map and drop a pin
                </p>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.price")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Tag size={16} className="shrink-0 text-ink-subtle" />
                <input
                  {...register("price")}
                  type="number"
                  placeholder="450000"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-rose-600">{errors.price.message}</p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.size")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Ruler size={16} className="shrink-0 text-ink-subtle" />
                <input
                  {...register("size")}
                  type="number"
                  placeholder="1800"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.size && (
                <p className="text-xs text-rose-600">{errors.size.message}</p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.bedrooms")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <BedDouble size={16} className="shrink-0 text-ink-subtle" />
                <input
                  {...register("bedrooms")}
                  type="number"
                  placeholder="3"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.bedrooms && (
                <p className="text-xs text-rose-600">
                  {errors.bedrooms.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.bathrooms")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Bath size={16} className="shrink-0 text-ink-subtle" />
                <input
                  {...register("bathrooms")}
                  type="number"
                  placeholder="2"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.bathrooms && (
                <p className="text-xs text-rose-600">
                  {errors.bathrooms.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.type")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Building2 size={16} className="shrink-0 text-ink-subtle" />
                <select
                  {...register("type")}
                  defaultValue=""
                  className="w-full bg-transparent text-sm text-ink focus:outline-none"
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
                <p className="text-xs text-rose-600">{errors.type.message}</p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.status")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Sparkles size={16} className="shrink-0 text-ink-subtle" />
                <select
                  {...register("status")}
                  className="w-full bg-transparent text-sm text-ink focus:outline-none"
                >
                  {PROPERTY_STATUS_VALUES.map((value) => (
                    <option key={value} value={value}>
                      {humanizeEnumValue(value)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.status && (
                <p className="text-xs text-rose-600">{errors.status.message}</p>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted md:col-span-2">
              {t("listing.label.description")}
              <div className="rounded-md border border-line bg-background-surface focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <textarea
                  {...register("description")}
                  placeholder="Describe the highlights, light, layout, and nearby spots."
                  className="h-32 w-full resize-none bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
              {errors.description && (
                <p className="text-xs text-rose-600">
                  {errors.description.message}
                </p>
              )}
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <div className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.amenities")}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITY_VALUES.map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md border border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink"
                  >
                    <input
                      {...register("amenities")}
                      type="checkbox"
                      value={value}
                      className="accent-primary-700"
                    />
                    {humanizeEnumValue(value)}
                  </label>
                ))}
              </div>
              {errors.amenities && (
                <p className="text-xs text-rose-600">
                  {errors.amenities.message as string}
                </p>
              )}
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
              {t("listing.label.upload")}
              <div className="flex items-center gap-2.5 rounded-md border border-line bg-background-surface px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30">
                <Upload size={16} className="shrink-0 text-ink-subtle" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full text-sm text-ink-muted file:mr-3 file:rounded file:border file:border-line file:bg-background-elevated file:px-3 file:py-1.5 file:text-sm file:text-ink"
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
              <p className="text-xs text-ink-subtle">
                Images will be stored under uploads/property/&lt;propertyId&gt;/
                on the server.
              </p>
            </label>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="btn-secondary disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            {t("listing.step.back")}
          </button>

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isSubmitting}
            className="btn-primary min-w-[10rem]"
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
