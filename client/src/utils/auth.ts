import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User } from "../types/types";

const TOKEN_KEY = "lexestate_token";

export type TokenPayload = {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  exp?: number;
};

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
  delete axios.defaults.headers.common.Authorization;
};

export const decodeUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return {
      id: String(decoded.id ?? "-1"),
      firstName: decoded.firstName || "",
      lastName: decoded.lastName || "",
      email: decoded.email || "",
      phone: decoded.phone || "",
      password: "",
    };
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const token = getStoredToken();
  if (!token) return null;

  const user = decodeUserFromToken(token);
  return user;
};
