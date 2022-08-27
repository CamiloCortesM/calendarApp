import React, { useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import "react-datepicker/dist/react-datepicker.css";
import { addHours, differenceInSeconds } from "date-fns";
import es from "date-fns/locale/es";

registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    title: "Camilo",
    notes: "Cortes",
    startDate: new Date(),
    endDate: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formValues.title.length > 0 ? "" : "is-invalid";
  }, [formValues.title, formSubmitted]);

  const { title, notes, startDate, endDate } = formValues;

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onDateChanged = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(
      formValues.endDate,
      formValues.startDate
    );

    if (isNaN(difference) || difference <= 0) {
      // console.log("Error en fechas");
      Swal.fire("Fechas incorretas", "Resvisar las fechas ingresadas", "error");
      return;
    }
    // if (formValues.startDate > formValues.endDate) return;
    if (formValues.title.length < 0) return;
    if (formValues.notes.length < 0) return;

    console.log(formValues);

    // TODO:
    //cerrar modal
    //Remover errores en pantalla
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMs={200}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          {/* <input className="form-control" placeholder="Fecha inicio" /> */}
          <DatePicker
            selected={startDate}
            className="form-control"
            onChange={(date) => onDateChanged(date, "startDate")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          {/* <input className="form-control" placeholder="Fecha inicio" /> */}
          <DatePicker
            minDate={startDate}
            selected={endDate}
            className="form-control"
            onChange={(date) => onDateChanged(date, "endDate")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            value={title}
            onChange={onInputChange}
            autoComplete="off"
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            value={notes}
            onChange={onInputChange}
            name="notes"
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
