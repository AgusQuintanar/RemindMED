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

async function fetchUser(citaID) {
	var response = await fetch(api.url + "/usuario", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ID_Usuario: citaID }),
	});

	if (response.status !== 200) return null;
	var user = await response.json();

	if (user.Foto) {
		const buffer = Buffer.from(user.Foto.data);
		const foto = buffer.toString("utf8");
		user.Foto = foto;
	}
	return user;
}

async function updateUser(citaID, userData, modifyUser) {
	var response = await fetch(api.url + "/usuario", {
		method: "put",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ID_Usuario: citaID, ...userData }),
	});

	if (response.status !== 200) return false;

	modifyUser({ ID_Usuario: citaID, ...userData });
	return true;
}

async function createUser(userData, addUser) {
	var response = await fetch(api.url + "/signup", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});

	if (response.status !== 200) return false;

	var citaID = await response.json();
	citaID = citaID[0];
	addUser({ ID_Usuario: citaID, ...userData });
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
		apellidos: "",
		correo: "",
		telefono: "",
		rol: "",
		contrasena: "",
		foto: null,
	});

	function validateEmail(email) {
		const re = new RegExp(
			/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
		);
		return re.test(email);
	}

	function handleChange(event) {
		setStateUser({ ...stateCita, [event.target.name]: event.target.value });
	}

	function handleSelect(event, data) {
		setStateUser({ ...stateCita, rol: data.value });
	}

	useEffect(() => {
		if (!props.citaID) return;
		async function fetchData() {
			const userData = await fetchUser(props.citaID);
			setStateUser({
				nombre: validateData(userData.Nombre),
				apellidos: validateData(userData.Apellidos),
				correo: validateData(userData.Correo),
				telefono: validateData(userData.Telefono),
				rol: validateData(userData.Rol),
				contrasena: validateData(userData.CONTRASENA),
				foto: userData.Foto,
			});
		}
		fetchData();
	}, [props]);

	const rolesOptions = [
		{ key: "Voluntario", value: "Voluntario", text: "Voluntario" },
		{ key: "Administrador", value: "Administrador", text: "Administrador" },
	];

	const [value, onChange] = useState(new Date());

	function handleRestablecer() {
		setStateUser({
			nombre: "",
			apellidos: "",
			correo: "",
			telefono: "",
			rol: "",
			contrasena: "",
			foto: null,
		});
	}

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
				<Modal.Header>{props.userID ? "Modificar Cita" : "Crear Cita"}</Modal.Header>
				<Modal.Content image>
					<Modal.Description className="descriptionRG">
						<Header>
							Datos de Cita
						</Header>
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
										value={stateCita.nombre}
									/>
								</div>
								<div className="block2RG">
									<Dropdown
										style={{
											width: "100%",
										}}
										button
										name="rol"
										selection
										fluid
										search
										className="icon selectRol"
										labeled
										icon="group"
										options={rolesOptions}
										placeholder="Paciente"
										onChange={handleSelect}
										value={stateCita.rol}
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
										name="correo"
										onChange={handleChange}
										value={stateCita.correo}
									/>
								</div>
								<div className="block2RG horarioPicker">
									<i
										aria-hidden="true"
										class="calendar icon"
									></i>
									<Datetime initialValue="Horario"/>
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
										name="contrasena"
										onChange={handleChange}
										value={stateCita.contrasena}
									/>
								</div>
							</div>
						</div>
					</Modal.Description>
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
							if (
								stateCita.nombre &&
								stateCita.apellidos &&
								stateCita.correo &&
								stateCita.telefono &&
								stateCita.rol &&
								stateCita.contrasena
							) {
								if (!validateEmail(stateCita.correo)) {
									setMessage(
										"El correo ingresado no es correcto"
									);
									setSuccess(false);
								} else {
									var success;
									if (props.citaID) {
										success = await updateUser(
											props.citaID,
											stateCita,
											props.modifyUser
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
										success = await createUser(
											stateCita,
											props.addUser
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
