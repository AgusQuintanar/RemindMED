import React, { useState, useEffect } from "react";
import "../Styles/AdminInfo.css";
import UserCard from "./UserCard.js";
import ModalAdmin from "./ModalAdmin";
import ModalBorrarUsuario from "./ModalBorrarUsuario";
import ModalBorrarUsuarioCon from "./ModalBorrarUsuarioCon";
import api from "../../shared_components/APIConfig";

async function fetchUsers(doctorId) {
	console.log("doctor id", doctorId);

	var response = await fetch(api.url + "/getPacientes?doctorId=" + doctorId, {
		method: "get",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return [];
	var users = await response.json();

	return users;
}

async function deleteUser(userID, removeUser) {
	console.log("userID", userID);
	var response = await fetch(api.url + "/deletePaciente?id="+userID, {
		method: "delete",
		headers: { "Content-Type": "application/json" },
	});

	if (response.status !== 200) return false;
	removeUser(userID);

	return true;
}

function Pacientes(props) {
	const [state, setState] = useState({
		users: [],
	});

	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	const [userID, setUserID] = useState("");
	const [msgDeleteUser, setMsgDeleteUser] = useState("");

	function changeUserID(id) {
		setUserID(id);
	}

	useEffect(() => {
		async function fetchData() {
			const usersData = await fetchUsers(props.ID_Usuario);
			setState({
				users: usersData,
			});
		}
		fetchData();
	}, [props]);

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
	function addUser(newUser) {
		setState((state) => ({
			users: [newUser, ...state.users],
		}));
	}

	function modifyUser(newUser) {
		console.log("ahhhhhhh", newUser, state.users);
		setState((state) => ({
			users: state.users.map((user) => {
				console.log(user);
				if (user.id === newUser.id) {
					console.log("siuuuuuuuuu");
					return newUser;
				} else {
					return user;
				}
			}),
		}));
	}

	function removeUser(userID) {
		setState((state) => ({
			users: state.users.filter((user) => user.id !== userID),
		}));
	}

	return (
		<div className="adminContainer">
			<div className="adminTitle">
				<div className="adminTitle1">
					<i className="fa fa-users"></i>
				</div>
				<div className="adminTitle2">Mis Pacientes</div>
			</div>

			<div className="btnGuardarAdmin">
				<button
					className="btn btn-4 btn-sep icon-plus"
					onClick={() => {
						setUserID("");
						setOpen(true);
					}}
				>
					Agregar Paciente
				</button>
			</div>

			<div className="user-cards">
				{state.users.map((user) => (
					<UserCard
						key={user.id}
						user={user}
						openModal={openModal}
						openModal2={openModal2}
						changeUserID={changeUserID}
						removeUser={removeUser}
					/>
				))}
			</div>

			{open ? (
				<ModalAdmin
					closeModal={closeModal}
					userID={userID}
					doctorId={props.ID_Usuario}
					fetchUsers={fetchUsers}
					modifyUser={modifyUser}
					addUser={addUser}
				/>
			) : null}
			{open2 ? (
				<ModalBorrarUsuario
					closeModal2={closeModal2}
					userID={userID}
					removeUser={removeUser}
					deleteUser={deleteUser}
					setMsgDeleteUser={setMsgDeleteUser}
					openModal3={openModal3}
				/>
			) : null}
			{open3 ? (
				<ModalBorrarUsuarioCon
					closeModal3={closeModal3}
					msgDeleteUser={msgDeleteUser}
				/>
			) : null}
		</div>
	);
}

export default Pacientes;
