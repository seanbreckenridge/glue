import React from "react";
import {AppContextConsumer, Context, swapInterfaceType} from "../../app_provider";

interface ISwapInterfaceButton {
  text: string;
}

const SwapInterfaceButton = ({text}: ISwapInterfaceButton) => {
  return (
    <AppContextConsumer>
      {(ctx: Context) => {
        return (
          <div>
            <button onClick={() => swapInterfaceType(ctx)}>
              {text}
            </button>
          </div>
        );
      }}
    </AppContextConsumer>
  );
}

export default SwapInterfaceButton;
