import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Modal from "react-modal";

import "react-datepicker/dist/react-datepicker.css";
import { addHours } from "date-fns";

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
  const [formValues, setFormValues] = useState({
    title: "Camilo",
    notes: "Cortes",
    startDate: new Date(),
    endDate: addHours(new Date(), 2),
  });

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
      <form className="container">
        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          {/* <input className="form-control" placeholder="Fecha inicio" /> */}
          <DatePicker
            selected={startDate}
            className="form-control"
            onChange={(date) => onDateChanged(date, "startDate")}
            dateFormat="Pp"
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
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className="form-control"
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
