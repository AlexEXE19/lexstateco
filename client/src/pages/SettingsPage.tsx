import { useState } from "react";
import { Globe, Ruler, DollarSign, Bell, Moon, Check } from "lucide-react";

type Language = "en" | "ro";
type Currency = "USD" | "EUR" | "RON";
type AreaUnit = "m2" | "ft2";
type DistanceUnit = "km" | "mi";

interface SettingsOptionProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

function SettingsOptionGroup<T extends string>({
  value,
  options,
  onChange,
}: SettingsOptionProps<T>) {
  return (
    <div className="inline-flex gap-1 rounded-md border border-line p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded px-3 py-1.5 text-sm transition-colors ${
            value === opt.value
              ? "bg-primary-800 font-medium text-white"
              : "text-ink-muted hover:bg-background-elevated hover:text-ink"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const SettingsPage: React.FC = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("m2");
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("km");

  // Placeholders — not modeled/wired yet, included so the page reads complete.
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      // TODO: persist { language, currency, areaUnit, distanceUnit, theme, emailNotifications, pushNotifications }
      console.log("Saving settings:", {
        language,
        currency,
        areaUnit,
        distanceUnit,
        theme,
        emailNotifications,
        pushNotifications,
      });
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-canvas px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-display-sm text-ink">Settings</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Manage how the app looks and how information is displayed to you.
        </p>

        {/* Regional */}
        <div className="mt-8">
          <p className="eyebrow mb-3 block">Regional</p>
          <div className="divide-y divide-line border-y border-line">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-ink-subtle" />
                <div>
                  <p className="text-sm text-ink">Language</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">Interface language</p>
                </div>
              </div>
              <SettingsOptionGroup
                value={language}
                onChange={setLanguage}
                options={[
                  { value: "en", label: "English" },
                  { value: "ro", label: "Română" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <DollarSign size={16} className="text-ink-subtle" />
                <div>
                  <p className="text-sm text-ink">Currency</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    Used for property prices
                  </p>
                </div>
              </div>
              <SettingsOptionGroup
                value={currency}
                onChange={setCurrency}
                options={[
                  { value: "USD", label: "$ USD" },
                  { value: "EUR", label: "€ EUR" },
                  { value: "RON", label: "RON" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Ruler size={16} className="text-ink-subtle" />
                <div>
                  <p className="text-sm text-ink">Area unit</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    Used for property size
                  </p>
                </div>
              </div>
              <SettingsOptionGroup
                value={areaUnit}
                onChange={setAreaUnit}
                options={[
                  { value: "m2", label: "m²" },
                  { value: "ft2", label: "ft²" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Ruler size={16} className="text-ink-subtle" />
                <div>
                  <p className="text-sm text-ink">Distance unit</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    Used for map and location distances
                  </p>
                </div>
              </div>
              <SettingsOptionGroup
                value={distanceUnit}
                onChange={setDistanceUnit}
                options={[
                  { value: "km", label: "km" },
                  { value: "mi", label: "mi" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Appearance — placeholder */}
        <div className="mt-8">
          <p className="eyebrow mb-3 block">
            Appearance{" "}
            <span className="text-xs text-ink-subtle">(placeholder)</span>
          </p>
          <div className="border-y border-line">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Moon size={16} className="text-ink-subtle" />
                <div>
                  <p className="text-sm text-ink">Theme</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">App color scheme</p>
                </div>
              </div>
              <SettingsOptionGroup
                value={theme}
                onChange={setTheme}
                options={[
                  { value: "dark", label: "Dark" },
                  { value: "light", label: "Light" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Notifications — placeholder */}
        <div className="mt-8">
          <p className="eyebrow mb-3 block">
            Notifications{" "}
            <span className="text-xs text-ink-subtle">(placeholder)</span>
          </p>
          <div className="divide-y divide-line border-y border-line">
            <label className="flex cursor-pointer items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-ink-subtle" />
                <div>
                  <p className="text-sm text-ink">Email notifications</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    Tour requests, messages, status updates
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 accent-primary-700"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-ink-subtle" />
                <div>
                  <p className="text-sm text-ink">Push notifications</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    Real-time alerts in the app
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="h-4 w-4 accent-primary-700"
              />
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            <Check size={14} />
            {isSaving ? "Saving..." : "Save settings"}
          </button>
          {saved && <span className="text-sm text-primary-700">Saved.</span>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
