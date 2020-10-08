import React from "react";
// import {AppContextConsumer, Context, swapInterfaceType} from "../app_provider";
import SwapInterfaceButton from "./components/swap_interface";
import TUITerminal from "./pages/terminal";

const TUI: React.FC<{}> = () => {
  return (
    <>
      <div id="tui" className="full-screen root-el">
        <div id="menu-bar">
          <div></div>
          <SwapInterfaceButton
            text="Switch to Graphical Interface"
            isGui={false}
          />
        </div>
        <div id="window-body">
          <TUITerminal />
        </div>
      </div>
    </>
  );
};
export default TUI;
