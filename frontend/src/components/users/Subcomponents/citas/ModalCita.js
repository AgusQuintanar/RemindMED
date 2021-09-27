import React, { useState, useEffect } from "react";
import "./Styles/CitaCard.css";
import "react-datetime/css/react-datetime.css";

import {
	Button,
	Modal,
	Icon,
	Dropdown,
	Header,
	Input,
} from "semantic-ui-react";
import "./Styles/ModalCita.css";
import api from "../../../shared_components/APIConfig";
import "../../../shared_components/Styles/Boton.css";
import Datetime from "react-datetime";
import { deleteUser } from "@firebase/auth";

async function fetchCita(citaID) {
	var response = await fetch(api.url + "/getCita?id=" + citaID, {
		method: "get",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return null;
	var cita = await response.json();

	console.log("citaaaaa", cita.horario);

	return cita;
}

async function fetchPacientes(doctorId) {
	console.log("doctor id", doctorId);

	var response = await fetch(api.url + "/getPacientes?doctorId=" + doctorId, {
		method: "get",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return [];
	var users = await response.json();

	var pacientes = [];
	users.forEach((p) => {
		pacientes.push({
			key: p.id,
			value: p.id,
			text: validateData(p.nombre) + " " + validateData(p.apellido),
		});
	});

	return pacientes;
}

async function updateCita(citaID, citaData, modifyCita) {
	var response = await fetch(api.url + "/updateCita?id=" + citaID, {
		method: "put",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(citaData),
	});

	if (response.status !== 200) return false;

	modifyCita({ id: citaID, ...citaData });
	return true;
}

async function createCita(citaData, addCita) {
	var response = await fetch(api.url + "/createCita", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(citaData),
	});

	if (response.status !== 200) return false;

	var citaID = await response.json();

	addCita({ id: citaID, ...citaData });
	return true;
}

async function deleteCita(citaID, removeCita) {
	console.log("citaID", citaID);
	var response = await fetch(api.url + "/deleteCita?id=" + citaID, {
		method: "delete",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return false;
	removeCita(citaID);

	return true;
}

function validateData(data) {
	return data ? data : "";
}

function ModalCita(props) {
	const [state, setState] = React.useState({
		open: true,
		dimmer: "blurring",
	});

	const { open, dimmer } = state;

	const [secondOpen, setSecondOpen] = React.useState(false);

	const [message, setMessage] = React.useState("");

	const [success, setSuccess] = React.useState(true);

	const [stateCita, setStateUser] = useState({
		nombre: "",
		pacienteId: "",
		motivo: "",
		horario: null,
		comentarios: "",
	});

	function handleChange(event) {
		setStateUser({ ...stateCita, [event.target.name]: event.target.value });
	}

	function handleSelect(event, data) {
		setStateUser({ ...stateCita, pacienteId: data.value });
	}

	useEffect(() => {
		async function fetchData() {
			const pacientes = await fetchPacientes(props.doctorId);
			setPacienteOptions(pacientes);
			if (!props.citaID) return;
			const cita = await fetchCita(props.citaID);
			setStateUser(cita);
		}
		fetchData();
	}, [props]);

	const [pacienteOptions, setPacienteOptions] = useState([]);

	function handleRestablecer() {
		setStateUser({
			nombre: "",
			pacienteId: "",
			motivo: "",
			horario: null,
			comentarios: "",
		});
	}

	if (!stateCita) return null;

	return (
		<div>
			<Modal
				dimmer={dimmer}
				open={open}
				onClose={() => {
					props.closeModal();
					setState({ open: false });
				}}
			>
				<Modal.Header>
					{props.citaID ? "Modificar Cita" : "Crear Cita"}
				</Modal.Header>
				<Modal.Content image>
					<Modal.Description className="descriptionRG">
						<Header>Datos de Cita</Header>
						<div className="containerCita">
							<div className="blockModal">
								<div className="block1RG">
									<Input
										autoComplete="off"
										size="large"
										style={{ width: "100%" }}
										icon="address card"
										iconPosition="left"
										placeholder="Nombre de la cita"
										name="nombre"
										onChange={handleChange}
										value={validateData(stateCita.nombre)}
									/>
								</div>
								<div className="block2RG">
									<Dropdown
										style={{
											width: "100%",
										}}
										button
										name="pacienteId"
										selection
										fluid
										search
										className="icon selectRol"
										labeled
										icon="group"
										options={pacienteOptions}
										placeholder="Paciente"
										onChange={handleSelect}
										value={validateData(
											stateCita.pacienteId
										)}
									/>
								</div>
							</div>

							<div className="blockModal">
								<div className="block1RG">
									<Input
										autoComplete="off"
										style={{ width: "100%" }}
										size="large"
										icon="medkit"
										iconPosition="left"
										placeholder="Motivo"
										name="motivo"
										onChange={handleChange}
										value={validateData(stateCita.motivo)}
									/>
								</div>
								<div className="block2RG horarioPicker">
									<i
										aria-hidden="true"
										class="calendar icon"
									></i>
									<Datetime
										value={
											stateCita.horario
												? new Date(stateCita.horario)
												: "Horario"
										}
										name="horario"
										onChange={(event) => {
											setStateUser({
												...stateCita,
												horario: event.toDate(),
											});
										}}
									/>
								</div>
							</div>

							<div className="blockModal">
								<div className="taCita">
									<Input
										style={{ width: "100%" }}
										autoComplete="off"
										size="large"
										icon="comment"
										iconPosition="left"
										placeholder="Comentarios"
										name="comentarios"
										onChange={handleChange}
										value={validateData(
											stateCita.comentarios
										)}
									/>
								</div>
							</div>
						</div>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					{props.citaID ? (
						<Button
							style={{
								borderRadius: "0.4rem",
								margin: "0% 2% 0% 0%",
							}}
							color="red"
							inverted
							onClick={async () => {
								var success = await deleteCita(
									props.citaID,
									props.removeCita
								);

								if (success) {
									setMessage("Cita borrada con éxito.");
								} else {
									setMessage("La cita no pudo ser borrada.");
								}
								setSecondOpen(true);
							}}
						>
							<Icon name="cancel" /> Eliminar
						</Button>
					) : null}

					<Button
						style={{
							borderRadius: "0.4rem",
							margin: "0% 2% 0% 0%",
						}}
						color="blue"
						inverted
						onClick={() => {
							props.closeModal();
							setState({ open: false });
							handleRestablecer();
						}}
					>
						<Icon name="cancel" /> Cancelar
					</Button>

					<Button
						style={{
							borderRadius: "0.4rem",
							margin: "0% 1% 0% 0%",
						}}
						color="green"
						inverted
						onClick={async () => {
							console.log(stateCita);
							if (
								stateCita.nombre &&
								stateCita.pacienteId &&
								stateCita.motivo &&
								stateCita.horario &&
								stateCita.comentarios
							) {
								var success;
								if (props.citaID) {
									success = await updateCita(
										props.citaID,
										stateCita,
										props.modifyCita
									);
									setSuccess(success);
									if (success) {
										setMessage(
											"Actualizacion de datos del usuario exitosa!"
										);
									} else {
										setMessage(
											"Ha ocurrido un error al actualizar el usuario! Verifique que el correo sea unico."
										);
									}
								} else {
									success = await createCita(
										{
											doctorId: props.doctorId,
											...stateCita,
										},
										props.addCita
									);
									setSuccess(success);

									if (success) {
										setMessage(
											"Se ha creado el usuario de manera exitosa!"
										);
									} else {
										setMessage(
											"Ha ocurrido un error al crear el usuario! Verifique que el correo sea unico."
										);
									}
								}

								// Funcion de insertar nuevo usuario
							} else {
								setMessage(
									"Debe llenar todos los campos para que el registro sea exitoso"
								);
								setSuccess(false);
							}

							setSecondOpen(true);
						}}
					>
						<Icon name="checkmark" />{" "}
						{props.citaID ? "Guardar" : "Registrar"}
					</Button>
				</Modal.Actions>
				<Modal
					onClose={() => setSecondOpen(false)}
					open={secondOpen}
					size="small"
				>
					<Modal.Header>Registro de usuario</Modal.Header>
					<Modal.Content>
						<p>{message}</p>
					</Modal.Content>
					<Modal.Actions>
						<Button
							style={{
								borderRadius: "0.4rem",
								margin: "0% 2% 0% 0%",
							}}
							color="red"
							inverted
							onClick={() => {
								setSecondOpen(false);
								if (success) {
									handleRestablecer();
									setState({ open: false });
									props.closeModal();
								}
							}}
						>
							<Icon name="cancel" /> Cerrar
						</Button>
					</Modal.Actions>
				</Modal>
			</Modal>
		</div>
	);
}

export default ModalCita;
