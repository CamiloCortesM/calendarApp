export const initialState = {
  status: "checking", //"not-authenticated" "authenticated"
  user: {},
  errorMessage: undefined,
};

export const authenticatedState = {
  status: "authenticated", //"not-authenticated" "authenticated"
  user: {
    uid: "abc",
    name: "Camilo",
  },
  errorMessage: undefined,
};

export const notAuthenticatedState = {
  status: "not-authenticated", //"not-authenticated" "authenticated"
  user: {},
  errorMessage: undefined,
};
