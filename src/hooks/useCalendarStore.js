import { useSelector, useDispatch } from "react-redux";
import calendarApi from "../api/calendarApi";
import {
  onAddNewEvent,
  onDeleteEvent,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    //TODO:Update event
    if (calendarEvent.id) {
      //actualizando
      dispatch(onUpdateEvent({ ...calendarEvent }));
    } else {
      try {
        const { data } = await calendarApi.post("/events", {
          ...calendarEvent,
        });
        console.log(data);
        dispatch(
          onAddNewEvent({
            ...calendarEvent,
            id: data.event.id,
            user,
          })
        );
      } catch (error) {
        console.log(error);
      }
      //creando
    }
  };

  const startDeletingEvent = async () => {
    //Todo: llegar al backend
    dispatch(onDeleteEvent());
  };
  return {
    //Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //Methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
  };
};
