import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ArrowRight } from "lucide-react";

import PropertyCard from "../components/property/PropertyCard";
import PropertyCardSkeleton from "../components/property/PropertyCardSkeleton";

import baseURL from "../config/baseUrl";
import { openPropertyModal } from "../state/propertyModal/propertyModalSlice";
import { Property } from "../schemas/Property";
import { useTranslation } from "../utils/i18n";

// The newest handful of listings, straight from the API - a homepage that
// shows real inventory reads far more like a working marketplace than one
// with placeholder marketing tiles.
const HomeListings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get<Property[]>(`${baseURL}/properties/`);
        setProperties(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
      } catch (err) {
        console.error("Error fetching featured properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (!loading && properties.length === 0) return null;

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t("home.listings.label")}</p>
            <h2 className="mt-3 font-display text-display-sm text-ink">
              {t("home.listings.title")}
            </h2>
          </div>

          <Link
            to="/properties"
            className="group inline-flex items-center gap-2 border-b border-ink pb-0.5 text-sm font-medium text-ink"
          >
            {t("home.listings.cta")}
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <PropertyCardSkeleton key={idx} />
              ))
            : properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  saved={false}
                  onSelect={(selected) => {
                    dispatch(openPropertyModal(selected));
                    navigate(`/properties/${selected.id}`);
                  }}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default HomeListings;
