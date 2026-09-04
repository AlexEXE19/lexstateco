import axios from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store";
import { setClientState } from "../state/client/clientSlice";

export const useClientMetadata = () => {
  const clientMeta = useSelector((state: RootState) => state.client);
  const dispatch = useDispatch();

  useEffect(() => {
    return;
    const getClientMetadata = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/");

        const newMeta = {
          city: res.data.city,
          region: res.data.region,
          countryName: res.data.country_name,
          countryCode: res.data.country_code,
          timezone: res.data.timezone,
          countryCallingCode: res.data.country_calling_code,
          currency: res.data.currency,
        };

        dispatch(setClientState(newMeta));
        localStorage.setItem("client_meta", JSON.stringify(newMeta));
      } catch (err) {
        console.error(err);
      }
    };

    getClientMetadata();
  }, [dispatch]);

  return clientMeta;
};
