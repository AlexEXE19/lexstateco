import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HousePlus } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import { RootState } from "../../state/store";
import { useSavedProperties } from "../../hooks/property/useSavedProperties";
import { useTranslation } from "../../utils/i18n";

// Tab showing user's saved properties
const SavedPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { properties } = useSavedProperties(userId);
  const { t } = useTranslation();

  if (!properties || properties.length === 0) {
    return (
      <Link
        to="/home"
        className="block rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-200 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl cursor-pointer"
      >
        {t("saved.cta")}
      </Link>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Saved
          </p>
          <h2 className="text-2xl font-semibold text-white">
            {t("saved.title")}
          </h2>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
        >
          <HousePlus size={16} />
          Discover more
        </Link>
      </div>

      <PropertyGrid properties={properties} saved />
    </div>
  );
};

export default SavedPropertiesTab;
