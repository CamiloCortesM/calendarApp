import {
  calendarSlice,
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent,
} from "../../../src/store/calendar/calendarSlice";
import {
    calendarWithActiveEventState,
  calendarWithEventsState,
  events,
  initialState,
} from "../../fixtures/calendarStates";

describe("test in calendarSlice", () => {
  test("must return initialstate", () => {
    expect(calendarSlice.getInitialState()).toEqual(initialState);
  });

  test("must return all events", () => {
    const state = calendarSlice.reducer(initialState, onLoadEvents(events));
    expect(state).toEqual(calendarWithEventsState);
  });

  test("onSetActiveEvent must return activeEvent", () => {
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onSetActiveEvent(events[0])
    );
    expect(state).toEqual({
      ...calendarWithEventsState,
      activeEvent: events[0],
    });
  });

  test("onAddNewEvent must add new event", () => {
    const newEvent = {
      id: "3",
      start: new Date("2022-09-08 13:00:00"),
      end: new Date("2022-09-08 15:00:00"),
      title: "Cumplaños del Astrid",
      notes: "Alguna nota de Astrid",
    };

    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onAddNewEvent(newEvent)
    );
    expect(state).toEqual({
      ...calendarWithEventsState,
      events: [...events, newEvent],
    });
  });
  test("onUpdateEvent must update event", () => {
    const updateEvent = {
      id: "1",
      start: new Date("2022-09-08 13:00:00"),
      end: new Date("2022-09-08 15:00:00"),
      title: "Cumplaños del Astrid",
      notes: "Alguna nota de Astrid",
    };
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onUpdateEvent(updateEvent)
    );
    expect(state).toEqual({
      ...calendarWithEventsState,
      events: [updateEvent, events[1]],
    });
  });
  test("onDeleteEvent must delete event", () => {
    const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
    expect(state).toEqual({
      ...calendarWithEventsState,
      events: [events[1]],
    });
  });
  test("onLogoutCalendar must logout and return intialState", () => {
    const state = calendarSlice.reducer(
        calendarWithActiveEventState,
      onLogoutCalendar()
    );
    expect(state).toEqual(initialState);
  });
});
