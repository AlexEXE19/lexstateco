import { describe, it, expect, beforeEach } from "vitest";
import userReducer, { logInUser, logOutUser } from "./userSlice";
import { getStoredToken } from "../../utils/auth";
import { User } from "../../schemas/User";

const anonymousUser: User = {
  id: "-1",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
};

describe("userSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts as the anonymous user when no token is stored", () => {
    expect(userReducer(undefined, { type: "@@INIT" })).toEqual(anonymousUser);
  });

  it("logInUser stores the logged-in user and clears the password field", () => {
    const state = userReducer(
      anonymousUser,
      logInUser({
        id: "7",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "should-be-dropped",
        phone: "555-0100",
      }),
    );

    expect(state).toEqual({
      id: "7",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "",
      phone: "555-0100",
    });
  });

  it("logOutUser resets to the anonymous user and clears the stored token", () => {
    localStorage.setItem("lexestate_token", "some.jwt.token");

    const state = userReducer(
      {
        id: "7",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "",
        phone: "555-0100",
      },
      logOutUser(),
    );

    expect(state).toEqual(anonymousUser);
    expect(getStoredToken()).toBeNull();
  });
});
