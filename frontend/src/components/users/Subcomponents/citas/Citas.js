import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

import "./Styles/Calendario.css";
import api from "../../../shared_components/APIConfig";
import ModalCita from "./ModalCita";

require("moment/locale/es.js");

const localizer = momentLocalizer(moment);

async function fetchEvents(doctorId) {
	var response = await fetch(api.url + "/getCitas?id=" + doctorId, {
		method: "get",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return [];
	var events = await response.json();

	console.log("events", events);

	return events;
}


function addMinutes(date, minutes) {
	return new Date(date.getTime() + minutes * 60000);
}

async function fetchCita(citaID) {
	var response = await fetch(api.url + "/events", {
		method: "get",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return [];
	var events = await response.json();

	return events;
}

function generateEvent(cita) {
	let date = null;
	try {
		date = new Date(cita.horario._seconds * 1000);
	} catch(e) {}


	const generatedEvent = {
		title: cita.nombre,
		start: date || new Date(cita.horario),
		end: addMinutes(date || new Date(cita.horario), 30),
		id: cita.id,
	};

	console.log(generatedEvent);
	return generatedEvent;
}

function Citas(props) {
	const [citas, setCitas] = useState([]);

	const [citaID, setCitaID] = useState("");

	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	function addCita(newCita) {
		setCitas([generateEvent(newCita), ...citas]);
	}

	function modifyCita(newCita) {
		setCitas((citas) =>
			citas.map((cita) => {
				if (cita.id === newCita.id) {
					return generateEvent(newCita);
				} else {
					return cita;
				}
			})
		);
	}

	function removeCita(citaID) {
		setCitas((citas) => (citas.filter((cita) => cita.id !== citaID)));
	}

	function closeModal() {
		setOpen(false);
	}

	function openModal() {
		setOpen(true);
	}

	function closeModal2() {
		setOpen2(false);
	}

	function openModal2() {
		setOpen2(true);
	}

	function closeModal3() {
		setOpen3(false);
	}

	function openModal3() {
		setOpen3(true);
	}

	function changeCitaID(id) {
		setCitaID(id);
	}

	useEffect(() => {
		async function fetchData() {
			const eventsData = await fetchEvents(props.ID_Usuario);

			let eventList = [];

			eventsData.forEach((event) => {
				const e = generateEvent(event);
				eventList.push(e);
			});

			setCitas(eventList);
		}
		fetchData();
	}, [props]);

	return (
		<div className="calendarComponent">
			<div className="btnAgregarCita">
				<button
					className="btn btn-4 btn-sep icon-plus"
					onClick={() => {
						setCitaID("");
						setOpen(true);
					}}
				>
					Agregar Cita
				</button>
			</div>
			<div className="calendario bigCalendar-container">
				<Calendar
					popup
					localizer={localizer}
					events={citas}
					defaultDate={new Date()}
					onSelectEvent={(event) => {
						console.log(event.id, event)
						changeCitaID(event.id);
						openModal();
					}}
				/>
			</div>
			{open ? (
				<ModalCita
					closeModal={closeModal}
					citaID={citaID}
					fetchCita={fetchCita}
					modifyCita={modifyCita}
					addCita={addCita}
					doctorId={props.ID_Usuario}
					removeCita={removeCita}
				/>
			) : null}
		</div>
	);
}

export default Citas;
