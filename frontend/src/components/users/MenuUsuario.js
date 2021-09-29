import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/MenuUsuario.css";
import { withRouter } from "react-router-dom";
import Pacientes from "./Subcomponents/Pacientes";
import Citas from "./Subcomponents/citas/Citas";

function MenuUsuario(props) {
	// const [state, setState] = useState({
	// 	nombre: "",
	// 	apellidos: "",
	// 	correo: "",
	// 	telefono: "",
	// 	rol: "",
	// 	foto: null,
	// });

	const [borderState, setBorderState] = useState({
		btnPacientes: "3px solid #00acee",
		btnCitas: "",
	});

	const [foregroundState, setForegroundState] = useState({
		btnPacientes: "#000",
		btnCitas: "",
	});

	const history = useHistory();

	function logoutSession() {
		sessionStorage.clear();
		window.location.reload();
		history.push("/");
	}

	function handleClick(name) {
		setBorderState({ [name]: "3px solid #00acee" });
		setForegroundState({ [name]: "#000" });
	}

	console.log(props.ID_Usuario);

	return (
		<div className="menuUsuarioContainer">
			<div className="sideBarContainer">
				<div
					className="sideBarBlock"
					onClick={() => {
						handleClick("btnPacientes");
					}}
				>
					<div className="sideBarIcon">
						<i
							style={{ color: foregroundState.btnPacientes }}
							className="fa fa-address-book fa-2x iconUsuario"
						></i>
					</div>
					<div className="sideBarBtn">
						<input
							autoComplete="off"
							style={{
								borderRight: borderState.btnPacientes,
								color: foregroundState.btnPacientes,
							}}
							type="button"
							className="btnMenuUsuario"
							value="Pacientes"
						/>
					</div>
				</div>

				<div
					className="sideBarBlock"
					onClick={() => {
						handleClick("btnCitas");
					}}
				>
					<div className="sideBarIcon">
						<i
							style={{ color: foregroundState.btnCitas }}
							className="fa fa-address-book fa-2x iconUsuario"
						></i>
					</div>
					<div className="sideBarBtn">
						<input
							autoComplete="off"
							style={{
								borderRight: borderState.btnCitas,
								color: foregroundState.btnCitas,
							}}
							type="button"
							className="btnMenuUsuario"
							value="Citas"
						/>
					</div>
				</div>

				<div className="sideBarBlock btnLogout">
					<div className="sideBarIcon">
						<i
							style={{ color: "red" }}
							className="fa fa-sign-out fa-2x iconUsuario"
						></i>
					</div>
					<div className="sideBarBtn">
						<input
							autoComplete="off"
							style={{ color: "red" }}
							type="button"
							className="btnMenuUsuario"
							value="Log out"
							onClick={logoutSession}
						/>
					</div>
				</div>
			</div>
			<div className="dataUsuario">
				{foregroundState.btnPacientes && (
					<Pacientes ID_Usuario={props.ID_Usuario} />
				)}
				{foregroundState.btnCitas && (
					<Citas ID_Usuario={props.ID_Usuario} />
				)}
			</div>
		</div>
	);
}

export default withRouter(MenuUsuario);
