import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../config/baseUrl";
import { setAuthToken } from "../utils/auth";
import { logInUser } from "../state/user/userSlice";
import { useTranslation } from "../utils/i18n";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

// Both login and register return an error message string on failure, or
// null on success - callers use that to decide whether to clear the form
// and alert, without depending on the hook's `error` state (which wouldn't
// be updated yet in the same tick the awaited call resolves).
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const login = async ({
    email,
    password,
  }: LoginPayload): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${baseURL}/auth/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      if (user && token) {
        setAuthToken(token);
        dispatch(
          logInUser({
            id: String(user.id ?? "-1"),
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "",
          }),
        );
        navigate("/account");
        return null;
      }

      const message = t("auth.login.error.generic");
      setError(message);
      return message;
    } catch (err: any) {
      const message =
        err.response && err.response.status === 404
          ? t("auth.login.error.notFound")
          : t("auth.login.error.generic");
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    payload: RegisterPayload,
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${baseURL}/auth/register`, payload);

      if (
        response.status === 201 &&
        response.data?.token &&
        response.data?.user
      ) {
        const { token, user } = response.data;
        setAuthToken(token);
        dispatch(
          logInUser({
            id: String(user.id ?? "-1"),
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "",
          }),
        );
        navigate("/get-started");
        return null;
      }

      const message = t("auth.register.error.generic");
      setError(message);
      return message;
    } catch (err) {
      console.error("Error during registration:", err);
      const message = t("auth.register.error.later");
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
