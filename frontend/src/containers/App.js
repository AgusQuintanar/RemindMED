import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import ErrorPage from "../components/shared_components/error_page/ErrorPage";
import Login from "../components/login/Login";
import SignUp from "../components/sign_up/SignUp";
import MenuUsuario from "../components/users/MenuUsuario";
import ProtectedRoute from "../components/shared_components/ProtectedRoute"

function saveUserSession(ID_User, isAuth) {
    sessionStorage.setItem(
        "userSession",
        JSON.stringify({
            ID_User,
            isAuth,
        })
    );
}

function getUserSession() {
    const tokenString = sessionStorage.getItem("userSession");
    const userToken = JSON.parse(tokenString);
    return userToken;
}

function App() {
    const userSession = getUserSession();
    var authenticated = false;
    var ID_Usuario = "";

    if (userSession) {
        const { ID_User, isAuth } = userSession;
        if (ID_User && isAuth) {
            authenticated = isAuth;
            ID_Usuario = ID_User;
        }
    }

    const [isAuth, setIsAuth] = useState(authenticated);

    function setAuth(boolean) {
        setIsAuth(boolean);
    }

    useEffect(() => {
        document.title = "RemindMED";
    });

    return (
        <div className="App">
            <Router>
                {/* <Route path="/RemindMED" render={MenuBar} /> */}

                <Switch>
                    <Route path="/" exact>
                        {/* <Login
                            setAuth={setAuth}
                            saveUserSession={saveUserSession}
                        /> */}
                        <MenuUsuario />
                    </Route>

                    <Route path="/SignUp" exact>
                        <SignUp
                            setAuth={setAuth}
                            saveUserSession={saveUserSession}
                        />
                    </Route>

                    <ProtectedRoute
                        path="/RemindMED"
                        exact
                        component={MenuUsuario}
                        isAuth={isAuth}
                    />

                    {/* <ProtectedRoute
                        path="/Laika/Calendario"
                        exact
                        component={Calendario}
                        isAuth={isAuth}
                    /> */}

                    <Route>
                        <ErrorPage />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
