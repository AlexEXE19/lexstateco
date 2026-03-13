import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import { Property } from "../types/types";
import { RootState } from "../state/store";
import baseURL from "../config/baseUrl";
import DeletePropertyModal from "../modals/DeletePropertyModal";
import EditPropertyModal from "../modals/EditPropertyModal";
import { useTranslation } from "../utils/i18n";

const UserPropertiesTab: React.FC = () => {
  const [userProperties, setUserProperties] = useState<Property[]>();
  const { t } = useTranslation();

  const userId = useSelector((state: RootState) => state.user.id);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen,
  );
  const modalType = useSelector((state: RootState) => state.modal.modalType);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/properties/seller-id/${userId}`,
        );
        setUserProperties(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setUserProperties([]);
          } else {
            console.error("Error fetching user properties:", error);
          }
        } else {
          console.error("Unknown error:", error);
        }
      }
    };
    fetchMyProperties();
  }, [userId]);

  return (
    <div className="space-y-6">
      {userProperties && userProperties.length > 0 ? (
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {userProperties.map((userProperty) => (
              <PropertyCard
                key={userProperty.id}
                property={userProperty}
                saved={false}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-200">
          {t("userProps.empty")}
        </div>
      )}
      {isModalOpen &&
        (modalType === "delete" ? (
          <DeletePropertyModal />
        ) : modalType === "edit" ? (
          <EditPropertyModal />
        ) : null)}
    </div>
  );
};

export default UserPropertiesTab;
