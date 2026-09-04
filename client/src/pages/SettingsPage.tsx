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
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            value === opt.value
              ? "bg-primary-500 text-white"
              : "bg-white/5 text-slate-300 hover:bg-white/10"
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
    <div className="min-h-screen bg-background px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage how the app looks and how information is displayed to you.
        </p>

        {/* Regional */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-slate-300">Regional</p>
          <div className="divide-y divide-white/10 border-y border-white/10">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-slate-500" />
                <div>
                  <p className="text-sm text-white">Language</p>
                  <p className="text-xs text-slate-500">Interface language</p>
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
                <DollarSign size={16} className="text-slate-500" />
                <div>
                  <p className="text-sm text-white">Currency</p>
                  <p className="text-xs text-slate-500">
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
                <Ruler size={16} className="text-slate-500" />
                <div>
                  <p className="text-sm text-white">Area unit</p>
                  <p className="text-xs text-slate-500">
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
                <Ruler size={16} className="text-slate-500" />
                <div>
                  <p className="text-sm text-white">Distance unit</p>
                  <p className="text-xs text-slate-500">
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
          <p className="mb-3 text-sm font-medium text-slate-300">
            Appearance{" "}
            <span className="text-xs text-slate-600">(placeholder)</span>
          </p>
          <div className="border-y border-white/10">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Moon size={16} className="text-slate-500" />
                <div>
                  <p className="text-sm text-white">Theme</p>
                  <p className="text-xs text-slate-500">App color scheme</p>
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
          <p className="mb-3 text-sm font-medium text-slate-300">
            Notifications{" "}
            <span className="text-xs text-slate-600">(placeholder)</span>
          </p>
          <div className="divide-y divide-white/10 border-y border-white/10">
            <label className="flex cursor-pointer items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-slate-500" />
                <div>
                  <p className="text-sm text-white">Email notifications</p>
                  <p className="text-xs text-slate-500">
                    Tour requests, messages, status updates
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 accent-primary-500"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-slate-500" />
                <div>
                  <p className="text-sm text-white">Push notifications</p>
                  <p className="text-xs text-slate-500">
                    Real-time alerts in the app
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="h-4 w-4 accent-primary-500"
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
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check size={14} />
            {isSaving ? "Saving..." : "Save settings"}
          </button>
          {saved && <span className="text-sm text-emerald-400">Saved.</span>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
