import React from "react";
import {AppContextConsumer, Context, swapInterfaceType} from "../app_provider";
import SwapInterfaceButton from "./components/swap_interface";

const TUI: React.FC<{}> = () => {
  return (
    <>
      <div id="tui" className="full-screen">
        <div id="menu-bar">
          <div>
            Terminal Bar Menu
          </div>
          <SwapInterfaceButton text="Switch to Graphical Interface"/>
        </div>
        <pre>
          $ ....
        </pre>
      </div>
    </>
  );
}
export default TUI;
