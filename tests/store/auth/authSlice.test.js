import { authSlice } from "../../../src/store/auth/authSlice";
import { initialState } from "../../fixtures/authStates";

describe("test in authSlice", () => {
  test("must return initialState", () => {
    expect(authSlice.getInitialState()).toEqual(initialState);
  });
});
