import React from "react";
import {
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import Cubing from "./components/cubing";
import Feed from "./components/feed";
import SwapInterfaceButton from "./components/swap_interface";
// import {AppContextConsumer, Context, swapInterfaceType} from "../app_provider";

const GUI: React.FC<{}> = () => {
  return (
    <>
      <div id="gui" className="full-screen root-el">
        <div id="menu-bar">
          <div className="menu-bar-item">
            sean
          </div>
          <SwapInterfaceButton text="Switch to Terminal" isGui={true}/>
        </div>
        <div id="window-body">
        <HashRouter>
          <Switch>
            <Route path="/cubing">
              <Cubing />
            </Route>
            <Route path="/feed">
              <Feed />
            </Route>
            <Route path="/">
              <>
                {/* Default home screen */}
                <h3>home screen</h3>
              </>
            </Route>
          </Switch>
        </HashRouter>
        </div>
      </div>
    </>
  );
};

export default GUI;
