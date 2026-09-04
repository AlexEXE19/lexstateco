import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PropertyGrid from "./PropertyGrid";
import { RootState } from "../../state/store";
import { openPropertyModal } from "../../state/propertyModal/propertyModalSlice";
import { useSavedProperties } from "../../hooks/property/useSavedProperties";
import { useTranslation } from "../../utils/i18n";

const SavedPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { properties } = useSavedProperties(userId);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return !properties || properties.length === 0 ? (
    <Link
      to="/properties"
      className="block rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-200 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl cursor-pointer"
    >
      {t("saved.cta")}
    </Link>
  ) : (
    <div className="space-y-6">
      <PropertyGrid
        properties={properties}
        isSaved={() => true}
        onSelect={(property) => {
          dispatch(openPropertyModal(property));
          navigate(`/properties/${property.id}`);
        }}
      />
    </div>
  );
};

export default SavedPropertiesTab;
