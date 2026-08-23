import { describe, it, expect, beforeEach } from "vitest";
import {
  getStoredToken,
  setAuthToken,
  clearAuthToken,
  decodeUserFromToken,
} from "./auth";

const base64url = (obj: unknown) =>
  btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fakeToken = (payload: Record<string, unknown>) =>
  `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url(payload)}.signature`;

describe("auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("decodeUserFromToken", () => {
    it("maps the JWT payload onto a User", () => {
      const token = fakeToken({
        id: 7,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "555-0100",
      });

      const user = decodeUserFromToken(token);

      expect(user).toEqual({
        id: "7",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "555-0100",
        password: "",
      });
    });

    it("returns null for a malformed token", () => {
      expect(decodeUserFromToken("not-a-jwt")).toBeNull();
    });
  });

  describe("token storage", () => {
    it("round-trips a token through localStorage", () => {
      expect(getStoredToken()).toBeNull();

      setAuthToken("abc.def.ghi");
      expect(getStoredToken()).toBe("abc.def.ghi");

      clearAuthToken();
      expect(getStoredToken()).toBeNull();
    });
  });
});
