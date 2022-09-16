import {
  authSlice,
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../../../src/store/auth/authSlice";
import {
  authenticatedState,
  initialState,
  notAuthenticatedState,
} from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe("test in authSlice", () => {
  test("must return initialState", () => {
    expect(authSlice.getInitialState()).toEqual(initialState);
  });

  test("must make the login", () => {
    const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
    expect(state).toEqual({
      ...authenticatedState,
      user: testUserCredentials,
    });
  });

  test("must make the logout", () => {
    const state = authSlice.reducer(authenticatedState, onLogout());
    expect(state).toEqual(notAuthenticatedState);
  });

  test("must make the logout", () => {
    const errorMessage = "Credencials error";
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
    expect(state).toEqual({ ...notAuthenticatedState, errorMessage });
  });

  test("must clear the errorMessage", () => {
    const errorMessage = "Credencials error";
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
    const newState = authSlice.reducer(state, clearErrorMessage());
    expect(newState.errorMessage).toBe(undefined);
  });

  test("should call checking and return the initialstate", () => {
    let state = authSlice.reducer(authenticatedState, onLogout());
    state = authSlice.reducer(state, onChecking());
    expect(state).toEqual(initialState);
  });
});
