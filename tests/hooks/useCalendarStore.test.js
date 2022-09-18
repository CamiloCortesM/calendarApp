import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import Swal from "sweetalert2";
import { calendarApi } from "../../src/api";
import { useCalendarStore } from "../../src/hooks";
import { authSlice, calendarSlice } from "../../src/store";
import {
  calendarWithEventsState,
  events,
  initialState,
} from "../fixtures/calendarStates";

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

const getMockStore = (initalState) => {
  return configureStore({
    reducer: {
      calendar: calendarSlice.reducer,
      auth: authSlice.reducer,
    },
    preloadedState: {
      calendar: { ...initalState },
      auth: {
        status: "authenticated",
        user: {
          uid: "123123123123",
          name: "Test",
        },
        errorMessage: undefined,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
describe("test in useCalendarStore", () => {
  beforeEach(() => jest.clearAllMocks());

  test("must return initalState", () => {
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    expect(result.current).toEqual({
      events: [],
      activeEvent: null,
      hasEventSelected: false,
      setActiveEvent: expect.any(Function),
      startSavingEvent: expect.any(Function),
      startDeletingEvent: expect.any(Function),
      startLoadingEvents: expect.any(Function),
    });
  });

  test("setActiveEvent must place the active event in the store  ", () => {
    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.setActiveEvent({ ...events[0] });
    });

    expect(result.current.activeEvent).toEqual({
      ...events[0],
    });
  });

  test("startSavingEvent must create new event", async () => {
    const newEvent = {
      start: new Date("2022-09-08 13:00:00"),
      end: new Date("2022-09-08 15:00:00"),
      title: "Cumplaños del Astrid",
      notes: "Alguna nota de Astrid",
    };

    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        event: {
          id: "testid",
          ...newEvent,
        },
      },
    });
    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });

    expect(result.current.events.length).toBe(3);
    expect(result.current.events[result.current.events.length - 1]).toEqual({
      id: "testid",
      ...newEvent,
      user: {
        uid: "123123123123",
        name: "Test",
      },
    });

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Creacion",
      "Se ha creado correctamente",
      "success"
    );
    spy.mockRestore();
  });

  test("startSavingEvent must fail ", async () => {
    const newEvent = {
      start: new Date("2022-09-08 13:00:00"),
    };

    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error en el Evento",
      expect.any(String),
      "error"
    );
  });

  test("startSavingEvent must edit event", async () => {
    const newEvent = {
      id: "1",
      start: new Date("2022-09-08 13:00:00"),
      end: new Date("2022-09-08 15:00:00"),
      title: "Cumplaños del Astrid",
      notes: "Alguna nota de Astrid",
    };

    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    const spy = jest.spyOn(calendarApi, "put").mockReturnValue({
      data: {
        event: {
          ...newEvent,
        },
      },
    });
    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });

    expect(result.current.events).toEqual([
      {
        ...newEvent,
        user: {
          uid: "123123123123",
          name: "Test",
        },
      },
      events[1],
    ]);

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Edicion",
      "Se ha Editado correctamente",
      "success"
    );

    spy.mockRestore();
  });

  test("startSavingEvent must fail edit", async () => {
    const newEvent = {
      id: "1",
    };

    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error en el Evento",
      expect.any(String),
      "error"
    );
  });
});
