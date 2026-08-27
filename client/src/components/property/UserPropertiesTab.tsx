import { useDispatch, useSelector } from "react-redux";
import PropertyGrid from "./PropertyGrid";
import { RootState } from "../../state/store";
import { openPropertyModal } from "../../state/propertyModal/propertyModalSlice";
import { useUserProperties } from "../../hooks/property/useUserProperties";
import { useTranslation } from "../../utils/i18n";

const UserPropertiesTab: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { properties } = useUserProperties(userId);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="space-y-6">
      {properties && properties.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                My listings
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {t("userProps.title")}
              </h2>
            </div>
          </div>

          <PropertyGrid
            properties={properties}
            saved={false}
            onSelect={(property) => dispatch(openPropertyModal(property))}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-200">
          {t("userProps.empty")}
        </div>
      )}
    </div>
  );
};

export default UserPropertiesTab;
