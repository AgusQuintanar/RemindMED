import React, { useState, useEffect } from "react";
import "../Styles/UserCard.css";

import {
	Button,
	Modal,
	Icon,
	Dropdown,
	Header,
	Input,
} from "semantic-ui-react";
import "../Styles/ModalAdmin.css";
import FotoUsuarioModal from "./FotoUsuarioModal";
import api from "../../shared_components/APIConfig";
import "../../shared_components/Styles/Boton.css";

async function fetchUser(userID) {
	var response = await fetch(api.url + "/getPaciente?id="+userID, {
		method: "get",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return null;
	var user = await response.json();

	// if (user.foto) {
	// 	const buffer = Buffer.from(user.foto.data);
	// 	const foto = buffer.toString("utf8");
	// 	user.foto = foto;
	// }
	return user;
}

async function updateUser(userID, userData, modifyUser) {
	var response = await fetch(api.url + "/updatePaciente?id="+userID, {
		method: "put",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});

	if (response.status !== 200) return false;

	modifyUser({ id: userID, ...userData });
	return true;
}

async function createUser(userData, addUser) {
	var response = await fetch(api.url + "/createPaciente", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});


	var res = await response.json();

	if (response.status !== 200) return [false, res];

	let userID = res;
	addUser({ id: userID, ...userData });
	return [true, userID];
}

function validateData(data) {
	return data ? data : "";
}

function ModalAdmin(props) {
	const [state, setState] = React.useState({
		open: true,
		dimmer: "blurring",
	});

	const { open, dimmer } = state;

	const [secondOpen, setSecondOpen] = React.useState(false);

	const [message, setMessage] = React.useState("");

	const [success, setSuccess] = React.useState(true);

	const [stateUser, setStateUser] = useState({
		nombre: "",
		apellido: "",
		email: "",
		celular: "",
		sexo: "",
		estadoCivil: "",
		fechaNacimiento: null,
		edad: "",
		foto: null,
	});

	function handleChange(event) {
		setStateUser({ ...stateUser, [event.target.name]: event.target.value });
	}

	function handleSelect(event, data, name) {
		console.log("holaaaaaaaaaa");
		console.log(event, data, name, "\n\n\n\n\n");
		setStateUser({ ...stateUser, [name]: data.value });
	}

	useEffect(() => {
		if (!props.userID) return;
		async function fetchData() {
			const userData = await fetchUser(props.userID);
			if (!userData) return;
			setStateUser({
				nombre: validateData(userData.nombre),
				apellido: validateData(userData.apellido),
				email: validateData(userData.email),
				celular: validateData(userData.celular),
				sexo: validateData(userData.sexo),
				estadoCivil: validateData(userData.estadoCivil),
				fechaNacimiento: validateData(userData.fechaNacimiento),
				edad: validateData(userData.edad),
				foto: userData.foto,
			});
		}
		fetchData();
	}, [props]);

	const sexoOptions = [
		{ key: "Masculino", value: "Masculino", text: "Masculino" },
		{ key: "Femenino", value: "Femenino", text: "Femenino" },
	];

	const estadoCivilOptions = [
		{ key: "Soltero", value: "Soltero", text: "Soltero" },
		{ key: "Casado", value: "Casado", text: "Casado" },
		{ key: "Divorciado", value: "Divorciado", text: "Divorciado" },
		{ key: "Viudo", value: "Viudo", text: "Viudo" },
		{ key: "Otro", value: "Otro", text: "Otro" },
	];

	function handleRestablecer() {
		setStateUser({
			nombre: "",
			apellido: "",
			email: "",
			celular: "",
			sexo: "",
			estadoCivil: "",
			fechaNacimiento: null,
			edad: "",
			foto: null,
		});
	}

	function imageHandler(event) {
		try {
			const reader = new FileReader();
			const foto = event.target.id;

			reader.onload = () => {
				if (reader.readyState === 2) {
					setStateUser({ ...stateUser, [foto]: reader.result });
				}
			};
			reader.readAsDataURL(event.target.files[0]);
		} catch (error) {}
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
				<Modal.Header>
					{props.userID ? "Modificar Paciente" : "Registrar Paciente"}
				</Modal.Header>
				<Modal.Content image>
					<FotoUsuarioModal
						id="foto"
						imageHandler={imageHandler}
						foto={stateUser.foto}
					/>
					<Modal.Description className="descriptionRG">
						<Header style={{ marginLeft: "10.5%" }}>
							Datos de Paciente
						</Header>
						<div className="containerUserRG">
							<div className="blockModal">
								<div className="block1RG">
									<Input
										style={{
											width: "100%",
											height: "100%",
										}}
										autoComplete="off"
										size="large"
										icon="address card"
										iconPosition="left"
										placeholder="Nombre(s)"
										name="nombre"
										onChange={handleChange}
										value={stateUser.nombre}
									/>
								</div>
								<div className="block2RG">
									<Input
										style={{
											width: "100%",
											height: "100%",
										}}
										autoComplete="off"
										size="large"
										icon="address book"
										iconPosition="left"
										placeholder="Apellido(s)"
										name="apellido"
										onChange={handleChange}
										value={stateUser.apellido}
									/>
								</div>
							</div>

							<div className="blockModal">
								<div className="block1RG">
									<Input
										style={{
											width: "100%",
											height: "100%",
										}}
										autoComplete="off"
										size="large"
										icon="envelope"
										iconPosition="left"
										placeholder="Correo"
										name="email"
										onChange={handleChange}
										value={stateUser.email}
									/>
								</div>
								<div className="block2RG">
									<Input
										style={{
											width: "100%",
											height: "100%",
										}}
										autoComplete="off"
										size="large"
										icon="call"
										iconPosition="left"
										placeholder="Celular"
										name="celular"
										onChange={handleChange}
										value={stateUser.celular}
									/>
								</div>
							</div>

							<div className="blockModal">
								<div className="block1RG">
									<Dropdown
										style={{
											width: "100%",
											height: "100%",
										}}
										button
										name="sexo"
										selection
										className="icon selectRol"
										labeled
										icon="group"
										options={sexoOptions}
										placeholder="Sexo"
										onChange={(event, data) => handleSelect(event, data, "sexo")}
										value={stateUser.sexo}
									/>
								</div>
								<div className="block2RG">
									<Dropdown
										style={{
											width: "100%",
											height: "100%",
										}}
										button
										name="estadoCivil"
										selection
										className="icon selectRol"
										labeled
										icon="group"
										options={estadoCivilOptions}
										placeholder="Estado Civil"
										onChange={(event, data) => handleSelect(event, data, "estadoCivil")}
										value={stateUser.estadoCivil}
									/>
								</div>
							</div>
							<div className="blockModal">
								<div className="block1RG">
									<Input
										style={{
											width: "100%",
											height: "100%",
										}}
										autoComplete="off"
										size="large"
										icon="address card"
										iconPosition="left"
										placeholder="Fecha nacimiento"
										name="fechaNacimiento"
										onChange={handleChange}
										value={stateUser.fechaNacimiento}
									/>
								</div>
								<div className="block2RG">
									<Input
										style={{
											width: "100%",
											height: "100%",
										}}
										autoComplete="off"
										size="large"
										icon="address book"
										iconPosition="left"
										placeholder="Edad"
										name="edad"
										onChange={handleChange}
										value={stateUser.edad}
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
							var success;
							var response;

							if (props.userID) {
								success = await updateUser(
									props.userID,
									stateUser,
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
								console.log(stateUser)
								
								const a = await createUser(
									{doctorId: props.doctorId, ...stateUser},
									props.addUser
								);
								success = a[0];
								response = a[1];

								setSuccess(success);

								if (success) {
									setMessage(
										"Se ha creado el usuario de manera exitosa!"
									);
								} else {
									setMessage(
										"Ha ocurrido un error al crear el paciente!. " + response
									);
								}
							}

							setSecondOpen(true);
						}}
					>
						<Icon name="checkmark" />{" "}
						{props.userID ? "Guardar" : "Registrar"}
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

export default ModalAdmin;
