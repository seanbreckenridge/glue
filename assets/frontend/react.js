import React from "react";
import ReactDOM from "react-dom";
import App from "./router"

import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./home";
import Cubing from "./cubing";
import Feed from "./feed";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/cubing">
          <Cubing name="Cubing" />
        </Route>
        <Route path="/feed">
          <Feed name="Feed" />
        </Route>
        <Route path="/">
          <Home name="Sean" />
        </Route>
      </Switch>
    </div>
  );
}

ReactDOM.render(
  <Router>
    <App />,
  </Router>,
  document.getElementById("root")
);
