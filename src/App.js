import React, { useState, useEffect } from "react";
import { Home, Vacations, AccountForm } from "./components";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import { fetchVacations, fetchGuest } from "./api/api";
import "./App.css";
const App = () => {
  const [vacation, setVacation] = useState([]);
  const [token, setToken] = useState(
    window.localStorage.getItem("token") || ""
  );
  const [guest, setGuest] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const getVacations = async () => {
      try {
        const result = await fetchVacations();
        setVacation(result);
      } catch (error) {
        console.error(error);
      }
    };
    getVacations();
  }, []);

  useEffect(() => {
    console.log("HERE");
    if (token) {
      const getGuest = async () => {
        const { guest } = await fetchGuest(token);
        setGuest(guest);
      };
      getGuest();
    }
  }, [token]);

  useEffect(() => {
    window.localStorage.setItem("token", token);
  }, [token]);

  const logOut = () => {
    setToken("");
    setGuest(null);
    history.push("/");
  };

  return (
    <div className="container">
      <nav className="ui secondary menu">
        <Link className="item" to="/">
          Home
        </Link>
        <Link className="item" to="/vacations">
          Vacations
        </Link>
        <div className="right menu">
          {token ? (
            <button onClick={logOut} className="item">
              Log Out
            </button>
          ) : (
            <>
              <Link className="item" to="/account/login">
                Log In
              </Link>
              <Link className="item" to="/account/register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home guest={guest} />
        </Route>
        <Route className="item" path="/vacations">
          <Vacations vacation={vacation} />
        </Route>
        <Route className="item" path="/account/:action">
          <AccountForm setToken={setToken} />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
