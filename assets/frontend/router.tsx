import React from "react";
import {
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import PersonalData from "./personal_data";
import Cubing from "./cubing";
import Feed from "./feed";
import Loading from "./loading";

function Routes() {
  return (
    <Loading>
      <HashRouter>
        <Switch>
        <Route path="/cubing">
          <Cubing />
        </Route>
        <Route path="/feed">
          <Feed />
        </Route>
        <Route path="/">
          <PersonalData />
        </Route>
        </Switch>
      </HashRouter>
    </Loading>
  );
}

export default Routes;
