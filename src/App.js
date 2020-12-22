import "./App.css";

// React
import React from "react";

// React Router
// import { Router, Route, Switch, Link } from "react-router";

// Components
import Nav from "./components/Nav/Nav.js";
import StandUpPage from "./pages/StandUpPage/StandUpPage.js";

import UserInfo from "./components/Login/UserInfo/UserInfo";

function App() {
  return (
    <div className="appContainer">
      <header>
        <Nav />
      </header>
      <main>
        <StandUpPage />

        <UserInfo />
      </main>
    </div>
  );
}

export default App;
