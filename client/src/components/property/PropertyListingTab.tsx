import { useState } from "react";
import { Home, MapPin, Ruler, Tag, Upload } from "lucide-react";
import { useLocationSuggestions } from "../../hooks/property/useLocationSuggestions";
import { useCreatePropertyForm } from "../../hooks/property/useCreatePropertyForm";
import FormField from "./FormField";
import StatusModal from "./StatusModal";
import { useTranslation } from "../../utils/i18n";

// Tab for listing a property
const PropertyListingTab: React.FC = () => {
  const { t } = useTranslation();
  const {
    title,
    setTitle,
    price,
    setPrice,
    locationInput,
    setLocationInput,
    neighborhood,
    setNeighborhood,
    zipCode,
    setZipCode,
    description,
    setDescription,
    size,
    setSize,
    setFiles,
    statusModal,
    closeStatusModal,
    submit,
  } = useCreatePropertyForm();

  const [query, setQuery] = useState<string>();
  const [suggestions, setSuggestions] = useState<any[]>();
  useLocationSuggestions(query, setSuggestions);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
          List a property
        </p>
        <h2 className="text-3xl font-semibold">{t("listing.title")}</h2>
        <p className="text-sm text-slate-300">{t("listing.subtitle")}</p>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:grid-cols-2"
      >
        <FormField
          label={t("listing.label.title")}
          icon={<Home size={16} className="text-primary-200" />}
          type="text"
          placeholder="Modern loft in downtown"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <FormField
          label={t("listing.label.price")}
          icon={<Tag size={16} className="text-primary-200" />}
          type="number"
          placeholder="450000"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || "")}
          required
        />

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("listing.label.location")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <MapPin size={16} className="text-primary-200" />
            <div>
              {" "}
              <input
                type="text"
                placeholder="Austin, TX"
                className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                value={locationInput}
                list="city-suggestions"
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setQuery(e.target.value);
                }}
                required
              />
              <datalist id="city-suggestions">
                {suggestions?.map((s, index) => (
                  <option key={index} value={s} />
                ))}
              </datalist>
            </div>
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          {t("listing.label.description")}
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <textarea
              placeholder="Describe the highlights, light, layout, and nearby spots."
              className="h-28 w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </label>

        <FormField
          label={t("listing.label.neighborhood")}
          icon={<MapPin size={16} className="text-primary-200" />}
          type="text"
          placeholder="East Austin"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          required
        />

        <FormField
          label={t("listing.label.zip")}
          icon={<Tag size={16} className="text-primary-200" />}
          type="text"
          placeholder="73301"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />

        <FormField
          label={t("listing.label.size")}
          icon={<Ruler size={16} className="text-primary-200" />}
          type="number"
          placeholder="1800"
          value={size}
          onChange={(e) => setSize(Number(e.target.value) || "")}
          required
        />

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
            className="w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400"
          >
            {t("listing.submit")}
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
    </div>
  );
};

export default PropertyListingTab;
