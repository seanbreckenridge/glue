import React from "react";
import {AppContextConsumer, Context, swapInterfaceType} from "../app_provider";

const TUI: React.FC<{}> = () => {
  return (
    <>
      <div id="tui" className="full-screen">
        <SwapInterfaceButton />
        <pre>
          $ ....
        </pre>
      </div>
    </>
  );
}

const SwapInterfaceButton: React.FC<{}> = () => {
  return (
    <AppContextConsumer>
      {(ctx: Context) => {
        return (
          <div className="swap-interface-button">
            <button onClick={() => swapInterfaceType(ctx)}>
              Switch to Desktop
            </button>
          </div>
        );
      }}
    </AppContextConsumer>
  );
}

export default TUI;
