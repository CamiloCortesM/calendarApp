import { addHours } from "date-fns";
import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";

export const FabAddNew = () => {
  const { user } = useAuthStore();
  const { openDateModal } = useUiStore();
  const { setActiveEvent } = useCalendarStore();

  const handleClickNew = () => {
    setActiveEvent({
      title: "",
      notes: "",
      start: new Date(),
      end: addHours(new Date(), 2),
      bgColor: "#fafafa",
      user: {
        id: user.uid,
        name: user.name,
      },
    });
    openDateModal();
  };
  return (
    <button className="btn btn-primary fab" onClick={handleClickNew}>
      <i className="fas fa-plus"></i>
    </button>
  );
};
