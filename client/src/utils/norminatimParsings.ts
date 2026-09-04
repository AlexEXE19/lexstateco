export const parseNominatimAddress = (address: any = {}) => {
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.municipality ||
    address.suburb ||
    "";

  const country = address.country || "";
  const zipcode = address.postcode || "";

  const county =
    address.county ||
    address.state_district ||
    address.province ||
    address.region ||
    "";

  const neighborhood =
    address.neighbourhood || address.residential || address.quarter || "";

  const street =
    address.road || address.pedestrian || address.footway || address.path || "";

  const houseNumber = address.house_number || "";

  const addressLine = [houseNumber, street].filter(Boolean).join(" ");

  return {
    city,
    county,
    country,
    zipcode,
    neighborhood,
    address: addressLine || street,
  };
};
