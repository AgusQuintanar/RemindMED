import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./styles/Login.css";

import AlertTitle from "@material-ui/lab/AlertTitle";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import api from "../shared_components/APIConfig";

async function fetchData(state) {
    console.log(state);
	var response = await fetch(api.url + "/Login", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(state),
	});
	return response;
}

function Login(props) {
	const [state, setState] = useState({ correo: "", contrasena: "" });

	const [alertState, setAlertState] = useState({
		openError: false,
		msg: "",
	});

	const history = useHistory();

	function handleClick() {
		history.push("/Laika/Consulta");
	}

	function goToSignUp() {
		history.push("/SignUp");
	}

	function handleChange(event) {
		setState({ ...state, [event.target.name]: event.target.value });
	}

	return (
		<div>
			<div className="alertLogin">
				<Collapse in={alertState.openError}>
					<Alert
						onClose={() => {
							setAlertState({
								...alertState,
								openError: false,
							});
						}}
						variant="outlined"
						severity="error"
					>
						<AlertTitle>Error</AlertTitle>
						{alertState.msg}
					</Alert>
				</Collapse>
			</div>

			<div className="login-root">
				<div
					className="box-root flex-flex flex-direction--column"
					style={{ minHeight: "100vh", flexGrow: 1 }}
				>
					<div className="loginbackground box-background--white padding-top--64">
						<div className="loginbackground-gridContainer">
							<div
								className="box-root flex-flex"
								style={{ gridArea: "top / start / 8 / end" }}
							>
								<div
									className="box-root"
									style={{
										backgroundImage:
											"linear-gradient(white 0%, rgb(247, 250, 252) 33%)",
										flexGrow: 1,
									}}
								></div>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "4 / 2 / auto / 5" }}
							>
								<div
									className="box-root box-divider--light-all-2 animationLeftRight tans3s"
									style={{ flexGrow: 1 }}
								/>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "6 / start / auto / 2" }}
							>
								<div
									className="box-root box-background--blue800"
									style={{ flexGrow: 1 }}
								/>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "7 / start / auto / 4" }}
							>
								<div
									className="box-root box-background--blue animationLeftRight"
									style={{ flexGrow: 1 }}
								/>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "8 / 4 / auto / 6" }}
							>
								<div
									className="box-root box-background--gray100 animationLeftRight tans3s"
									style={{ flexGrow: 1 }}
								/>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "2 / 15 / auto / end" }}
							>
								<div
									className="box-root box-background--cyan200 animationRightLeft tans4s"
									style={{ flexGrow: 1 }}
								/>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "3 / 14 / auto / end" }}
							>
								<div
									className="box-root box-background--blue animationRightLeft"
									style={{ flexGrow: 1 }}
								/>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "4 / 17 / auto / 20" }}
							>
								<div
									className="box-root box-background--gray100 animationRightLeft tans4s"
									style={{ flexGrow: 1 }}
								/>
							</div>
							<div
								className="box-root flex-flex"
								style={{ gridArea: "5 / 14 / auto / 17" }}
							>
								<div
									className="box-root box-divider--light-all-2 animationRightLeft tans3s"
									style={{ flexGrow: 1 }}
								/>
							</div>
						</div>
					</div>
					<div
						className="box-root padding-top--24 flex-flex flex-direction--column"
						style={{ flexGrow: 1, zIndex: 9 }}
					>
						<div className="login-title box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
							<h1>RemindMED</h1>
						</div>
						<div className="formbg-outer">
							<div className="formbg">
								<div className="formbg-inner padding-horizontal--48">
									<span className="padding-bottom--15">
										Inicia sesión
									</span>
									<form id="stripe-login">
										<div className="field login-label padding-bottom--24">
											<label htmlFor="email">Email</label>
											<input
												type="email"
												autoComplete="off"
												name="correo"
												onChange={handleChange}
											/>
										</div>
										<div className="field padding-bottom--24">
											<div className="login-label grid--50-50">
												<label htmlFor="password">
													Contraseña
												</label>
											</div>
											<input
												type="password"
												name="contrasena"
												onChange={handleChange}
												autoComplete="off"
											/>
										</div>
									</form>

									<div className="fieldLogin padding-bottom--24">
										<input
											type="submit"
											name="submit"
											value="Enviar"
											onClick={async () => {
												console.log("hola");

												const data = await fetchData(
													state
												);
												const json = await data.json();

												if (data.status === 200) {
													props.saveUserSession(
														json.ID_Usuario,
														true
													);
													props.setAuth(true);

													handleClick();
												} else if (
													data.status === 404
												) {
													setAlertState({
														...alertState,
														openError: true,
														msg: "Correo y contraseña inválidos",
													});
												} else {
													setAlertState({
														...alertState,
														openError: true,
														msg: "No se puede conectar con el servidor en estos momentos. Porvafor intente mas tarde.",
													});
												}
											}}
										/>
									</div>
								</div>
							</div>
							<div className="footer-link padding-top--24">
								<span className="goToSignUp">
									No tiene una cuenta?{" "}
									<a onClick={() => goToSignUp()}>
										Reqistrate
									</a>
								</span>

								{/* <div className="reset-pass">
								<a href="#">Forgot your password?</a>
							</div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Login;
