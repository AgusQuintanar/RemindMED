import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

import "./Styles/Calendario.css";
import api from "../../../shared_components/APIConfig";
import ModalCita from "./ModalCita"

require("moment/locale/es.js");

const localizer = momentLocalizer(moment);

async function fetchEvents() {
	var response = await fetch(api.url + "/events", {
		method: "get",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return [];
	var events = await response.json();

	return events;
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

function generateEvent(message, animalId, animalName, date) {
	const eventDate = new Date(date);
	eventDate.setHours(12, 0, 0, 0);
	const generatedEvent = {
		title: message + animalName + " (ID: " + animalId + ")",
		start: eventDate,
		end: eventDate,
		cita_id: "fg344e3g",
	};
	return generatedEvent;
}

function decodeEvents(encodedEvents) {
	if (!encodedEvents) return;

	const decoder = {
		FechaRescate: "Se rescato a ",
		FechaInicioHT: "Inicio de Hogar Temporal de ",
		VisitaAdopcion: "Se realizo visita de adopcion a ",
		FechaAdopcion: "Se adopto a ",
		FechaVacuna1: {
			Canino: "Puppy",
			Felino: "Triple Viral Felina",
			Otro: "Vacuna 1",
		},
		FechaVacuna2: {
			Canino: "Refuerzo Puppy",
			Felino: "Refuerzo Triple Viral Felina",
			Otro: "Vacuna 2",
		},
		FechaVacuna3: {
			Canino: "Multiple",
			Felino: "Leucemia",
			Otro: "Vacuna 3",
		},
		FechaVacuna4: {
			Canino: "Refuerzo Multiple",
			Felino: "Desparasitacion",
			Otro: "Vacuna 4",
		},
		FechaVacuna5: {
			Canino: "Rabia",
			Felino: "Rabia",
			Otro: "Vacuna 5",
		},
	};

	var eventsList = [];

	encodedEvents.forEach((animal) => {
		const animalId = animal["ID_Animal"];
		const animalName = animal["Nombre"];
		const animalSpecie = animal["Especie"];

		for (const event in animal) {
			const eventDate = animal[event];
			if (!eventDate) continue;

			if (
				event === "ID_Animal" ||
				event === "Nombre" ||
				event === "Especie"
			)
				continue;

			if (event.includes("FechaVacuna")) {
				if (!decoder[event]) continue;

				const vacuna = decoder[event][animalSpecie];

				const numFecha = event.charAt(event.length - 1);
				const estaVacuando = animal["vacuna" + numFecha];

				const mensaje =
					estaVacuando === 1
						? "Se aplico vacuna " + vacuna + " a "
						: "Cita agendada de vacuna " + vacuna + " de ";

				const generatedEvent = generateEvent(
					mensaje,
					animalId,
					animalName,
					eventDate
				);
				eventsList.push(generatedEvent);
			} else if (event === "CitasMedicas") {
				const citasMedicas = eventDate.split(",");
				citasMedicas.forEach((citaMedica) => {
					const generatedEvent = generateEvent(
						"Cita medica de ",
						animalId,
						animalName,
						citaMedica
					);
					eventsList.push(generatedEvent);
				});
			} else if (event === "FechaEsterilizacion") {
				const estaEsterilizado = animal["EstaEsterilizado"];
				const mensaje =
					estaEsterilizado === "Sí" || estaEsterilizado === "Si"
						? "Se esterilizo a "
						: "Cita agendada de esterilizacion de ";

				const generatedEvent = generateEvent(
					mensaje,
					animalId,
					animalName,
					eventDate
				);
				eventsList.push(generatedEvent);
			} else {
				if (!decoder[event]) continue;
				const generatedEvent = generateEvent(
					decoder[event],
					animalId,
					animalName,
					eventDate
				);
				eventsList.push(generatedEvent);
			}
		}
	});

	return eventsList;
}

function Citas(props) {
	const [events, setEvents] = useState([]);

	const [state, setState] = useState({
		citas: [],
	});

    const [citaID, setCitaID] = useState("");

	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	function addCita(newCita) {
		const newCitaM = {
			ID_Usuario: newCita.ID_Usuario,
			Nombre: newCita.nombre,
			Apellidos: newCita.apellidos,
			Correo: newCita.correo,
			Telefono: newCita.telefono,
			Rol: newCita.rol,
			CONTRASENA: newCita.contrasena,
			Foto: newCita.foto,
		};
		setState((state) => ({
			citas: [newCitaM, ...state.citas],
		}));
	}

	function modifyCita(newCita) {
		setState((state) => ({
			citas: state.citas.map((cita) => {
				if (cita.ID_Usuario === newCita.ID_Usuario) {
					return {
						ID_Usuario: newCita.ID_Usuario,
						Nombre: newCita.nombre,
						Apellidos: newCita.apellidos,
						Correo: newCita.correo,
						Telefono: newCita.telefono,
						Rol: newCita.rol,
						CONTRASENA: newCita.contrasena,
						Foto: newCita.foto,
					};
				} else {
					return cita;
				}
			}),
		}));
	}

	function removeCita(citaID) {
		setState((state) => ({
			citas: state.citas.filter((cita) => cita.ID_Usuario !== citaID),
		}));
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

	useEffect(() => {
		async function fetchData() {
			const eventsData = await fetchEvents();

			const eventList = decodeEvents(eventsData);

			setEvents(eventList);
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
					events={events}
					defaultDate={new Date()}
					onSelectEvent={(event) => console.log(event)}
				/>
			</div>
			{open ? (
				<ModalCita
					closeModal={closeModal}
					citaID={citaID}
					fetchCita={fetchCita}
					modifyCita={modifyCita}
					addCita={addCita}
				/>
			) : null}
		</div>
	);
}

export default Citas;
