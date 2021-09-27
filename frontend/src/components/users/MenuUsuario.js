import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/MenuUsuario.css";
import { withRouter } from "react-router-dom";
import Pacientes from "./Subcomponents/Pacientes";
import api from "../shared_components/APIConfig";
import Citas from "./Subcomponents/citas/Citas";

async function fetchUser(ID_Usuario) {
	var response = await fetch(api.url + "/usuario", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ID_Usuario }),
	});

	if (response.status !== 200) return null;
	var json = await response.json();

	return json;
}

function MenuUsuario(props) {
	const [state, setState] = useState({
		nombre: "",
		apellidos: "",
		correo: "",
		telefono: "",
		rol: "",
		foto: null,
	});

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

	useEffect(() => {
		async function fetchData() {
			const userData = await fetchUser(props.ID_Usuario);
			if (!userData) return;

			setState({
				pacientes: userData.pacientes,
			});
		}
		fetchData();
	}, [props]);

	function handleClick(name) {
		setBorderState({ [name]: "3px solid #00acee" });
		setForegroundState({ [name]: "#000" });
	}

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
					<Pacientes ID_Usuario={props.ID_Usuario} state={state} />
				)}
                {foregroundState.btnCitas && (
					<Citas ID_Usuario={props.ID_Usuario} state={state} />
				)}
			</div>
		</div>
	);
}

export default withRouter(MenuUsuario);
