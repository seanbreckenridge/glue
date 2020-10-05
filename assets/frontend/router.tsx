import React from "react";
import {
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import Home from "./home";
import Cubing from "./cubing";
import Feed from "./feed";
import Layout from "./layout";

function Routes() {
  return (
    <Layout>
      <HashRouter>
        <Switch>
        <Route path="/cubing">
          <Cubing />
        </Route>
        <Route path="/feed">
          <Feed />
        </Route>
        <Route path="/">
          <Home />
        </Route>
        </Switch>
      </HashRouter>
    </Layout>
  );
}

export default Routes;
