import React from "react";
import {AppContextProvider, AppContextConsumer, Context} from "../app_provider"
import GUI from "./gui";
import TUI from "./tui";
// import {some, ok} from "./utils";

// top level of interface
// renders the the initial loading screen, makes requests off to APi
const Computer: React.FC<{}> = () => {
  return (
    <>
      <AppContextProvider>
        <HomeScreen />
      </AppContextProvider>
    </>
  );
}

// render home page, switch between GUI and TUI
// TODO: add loading animation
export const HomeScreen: React.FC<{}> = () => {
  return (
    <>
    <AppContextConsumer>
      {(ctx: Context) => {
        return (ctx.opts.gui) ? <GUI /> : <TUI />
      }}
    </AppContextConsumer>
    </>
  );
}

export default Computer;
