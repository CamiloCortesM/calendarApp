import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { useAuthStore } from "../../src/hooks";
import { authSlice } from "../../src/store";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: { ...initialState },
    },
  });
};

describe("test in useAuthStore", () => {
  test("must return initialState", () => {
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    expect(result.current).toEqual({
      status: "checking",
      user: {},
      errorMessage: undefined,
      startRegister: expect.any(Function),
      startLogin: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogout: expect.any(Function),
    });
  });

  test("startlogin must login correctly", async () => {
    localStorage.clear();
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    await act(async () => {
      await result.current.startLogin(testUserCredentials);
    });
    const { errorMessage, status, user } = result.current;
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: { name: testUserCredentials.name, uid: testUserCredentials.uid },
    });

    expect(localStorage.getItem("token")).toEqual(expect.any(String));
    expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String));
  });

  test("startlogin must fail login authentication", async () => {
    localStorage.clear();
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.startLogin({
        email: "testFail@gmail.com",
        password: "1234567",
      });
    });

    const { errorMessage, user, status } = result.current;

    expect(localStorage.getItem("token")).toBe(null);
    expect({ errorMessage, user, status }).toEqual({
      errorMessage: expect.any(String),
      status: "not-authenticated",
      user: {},
    });

    await waitFor(() => expect(result.current.errorMessage).toBe(undefined));
  });
});
