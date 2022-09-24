import { fireEvent, render, screen } from "@testing-library/react";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../src/hooks/useCalendarStore";

jest.mock("../../../src/hooks/useCalendarStore");

describe("test in component <FabDelete />", () => {
  const mockStartDeletingEvent = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test("must display the component correctly", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: false,
    });
    render(<FabDelete />);

    const btn = screen.getByLabelText("btn-delete");
    expect(btn.classList).toContain("btn");
    expect(btn.classList).toContain("btn-danger");
    expect(btn.classList).toContain("fab-danger");
    expect(btn.style.display).toBe("none");
  });

  test("must display the button if there is activeEvent", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
    });
    render(<FabDelete />);

    const btn = screen.getByLabelText("btn-delete");

    expect(btn.style.display).toBe("");
  });

  test("must called startDeletingEvent if there is activeEvent", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeletingEvent: mockStartDeletingEvent,
    });
    render(<FabDelete />);

    const btn = screen.getByLabelText("btn-delete");

    fireEvent.click(btn);

    expect(mockStartDeletingEvent).toHaveBeenCalledWith();
  });
});
