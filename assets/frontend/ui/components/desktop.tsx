import React from "react";
import {
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import Cubing from "./cubing";
import Feed from "./feed";
import {AppContextConsumer, Context, swapInterfaceType} from "../../app_provider";

const Desktop: React.FC<{}> = () => {
  return (
    <>
      <div id="gui" className="full-screen">
        <div id="menu-bar">
          <div>
            Menu bar contents
          </div>
          <SwapInterfaceButton />
        </div>
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
    </>
  );
};

const SwapInterfaceButton: React.FC<{}> = () => {
  return (
    <AppContextConsumer>
      {(ctx: Context) => {
        return (
          <div>
            <button onClick={() => swapInterfaceType(ctx)}>
              Switch to Terminal
            </button>
          </div>
        );
      }}
    </AppContextConsumer>
  );
}

export default Desktop;
