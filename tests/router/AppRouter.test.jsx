import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/router/AppRouter";

jest.mock("../../src/hooks/useAuthStore");

jest.mock("../../src/calendar", () => ({
  CalendarPage: () => <h1>CalendarPage</h1>,
}));

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

  test("must display the login if there is not-authenticated", () => {
    useAuthStore.mockReturnValue({
      status: "not-authenticated",
      checkAuthToken: mockcheckAuthToken,
    });
    const { container } = render(
      <MemoryRouter initialEntries={["/auth2/algo/otracosa"]}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText("Ingreso")).toBeTruthy();
    expect(screen.getByText("Registro")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test("must display the Calendar if there is authenticated", () => {
    useAuthStore.mockReturnValue({
      status: "authenticated",
      checkAuthToken: mockcheckAuthToken,
    });
    render(
      <MemoryRouter initialEntries={["/auth2/algo/otracosa"]}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("CalendarPage")).toBeTruthy();
  });
});
