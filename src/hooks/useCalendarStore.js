import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
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
    try {
      if (calendarEvent.id) {
        await calendarApi.put(`/events/${calendarEvent.id}`, {
          ...calendarEvent,
        });
        dispatch(
          onUpdateEvent({
            ...calendarEvent,
            user,
          })
        );
        Swal.fire("Edicion", "Se ha Editado correctamente", "success");
        return;
      }
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
      Swal.fire("Creacion", "Se ha creado correctamente", "success");
    } catch (error) {
      Swal.fire("Error en el Evento", error.response.data?.msg, "error");
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch(onDeleteEvent());
      Swal.fire("Eliminacion", "Se ha eliminado correctamente", "success");
    } catch (error) {
      Swal.fire("Error en la Eliminacion", error.response.data?.msg, "error");
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");
      const events = convertEventsToDateEvents(data.events);
      console.log(events);
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log("Error cargando eventos", error);
    }
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
    startLoadingEvents,
  };
};
