import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./styles/Login.css";

import AlertTitle from "@material-ui/lab/AlertTitle";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import api from "../shared_components/APIConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCkLoDfpk7UfE6tBVIssITp9t8Ym9Y8rCs",
    authDomain: "remindmed-408e4.firebaseapp.com",
    databaseURL: "https://remindmed-408e4-default-rtdb.firebaseio.com",
    projectId: "remindmed-408e4",
    storageBucket: "remindmed-408e4.appspot.com",
    messagingSenderId: "360254772107",
    appId: "1:360254772107:web:25bfcad9fcf85f787f958e"
  };


const app = initializeApp(firebaseConfig);

function Login(props) {
	const [state, setState] = useState({ correo: "", contrasena: "" });

	const [alertState, setAlertState] = useState({
		openError: false,
		msg: "",
	});

	const history = useHistory();

	function handleClick() {
		history.push("/RemindMED");
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

												const auth = getAuth(app);
												signInWithEmailAndPassword(
													auth,
													state.correo,
													state.contrasena
												)
													.then((userCredential) => {
														// Signed in
														const user =
															userCredential.user;

                                                        console.log(user);

														props.saveUserSession(
															"1234",
															true
														);
														props.setAuth(true);

														handleClick();
													})
													.catch((error) => {
														const errorCode =
															error.code;
														const errorMessage =
															error.message;

														setAlertState({
															...alertState,
															openError: true,
															msg: error.message,
														});
													});
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
