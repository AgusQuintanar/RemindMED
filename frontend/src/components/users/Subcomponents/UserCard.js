import React from "react";
import "../Styles/UserCard.css";

function validateData(data) {
    return data ? data : "No hay Información";
}

export default function UserCard(props) {
    return (
        <div className="user-card">
            <div className="cardIcons">
                <div className="editIcon">
                    <i
                        aria-hidden="true"
                        className="fa fa-pencil"
                        onClick={() => {
                            props.changeUserID(props.user.id);
                            props.openModal();
                        }}
                    ></i>
                </div>
                <div className="deleteIcon">
                    <i
                        aria-hidden="true"
                        className="fa fa-trash"
                        onClick={async () => {
                            props.changeUserID(props.user.id);
                            props.openModal2();
                        }}
                    ></i>
                </div>
            </div>

            <div className="image-wrapper">
                <img
                    src={props.user.foto ? props.user.foto : "/defaultUser.png"}
                    alt=""
                />
            </div>

            <div className="userInfo">
                <p className="user-name">
                    {" "}
                    {props.user.nombre && props.user.apellido
                        ? props.user.nombre + " " + props.user.apellido
                        : "No hay Información"}{" "}
                </p>

                <div className="rowUser">
                    <i aria-hidden="true" className="fa fa-envelope"></i>
                    <p> {validateData(props.user.email)} </p>
                </div>

                <div className="rowUser">
                    <i aria-hidden="true" className="fas fa-phone"></i>
                    <p> {validateData(props.user.celular)} </p>
                </div>
            </div>

            <p className="user-role"> {validateData(props.user.sexo)} </p>
        </div>
    );
}
