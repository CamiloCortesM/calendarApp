import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/router/AppRouter";

jest.mock("../../src/hooks/useAuthStore");

describe("test in AppRouter", () => {
  const mockcheckAuthToken = jest.fn();
  beforeEach(() => jest.clearAllMocks());

  test("must display the loading screen and call checkAuthToken", () => {
    useAuthStore.mockReturnValue({
      status: "checking",
      checkAuthToken: mockcheckAuthToken,
    });
    render(<AppRouter />);
    expect(screen.getByText("Cargando...")).toBeTruthy();
    expect(mockcheckAuthToken).toHaveBeenCalledWith();
  });
});
