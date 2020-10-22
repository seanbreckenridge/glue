import React, { useEffect, useState } from "react";

import { setWindowMsg } from "./../home";
import { jitterCenterLocation } from "./../components/dimensions";
import Dialog from "../components/dialog";
import { launchWindowFunc } from "./actions";
import { PaintControls } from "./paint";
import {
  Context,
  AppContextConsumer,
  setBackgroundColor,
} from "../../app_provider";

const minHeight = 220;
const minWidth = 400;

export function CustomizeWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y } = jitterCenterLocation();
    const windowId = Date.now().toString();
    const dialogObj = (
      <>
        <Dialog
          x={x - minWidth / 2}
          y={y - minHeight / 2}
          width={minWidth}
          height={minHeight}
          title="customize"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          disableBodyDragging={true}
          // when close is hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <AppContextConsumer>
            {(value: Context) => {
              return <CustomizeBody ctx={value} />;
            }}
          </AppContextConsumer>
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: dialogObj,
    });
  };
}

interface ICustomizeBody {
  ctx: Context;
}

const CustomizeBody = ({ ctx }: ICustomizeBody) => {
  const [bgColor, setBgColor] = useState<string>(ctx.backgroundColor);

  // when setBgColor is called from the PaintControls
  // set the global background color
  useEffect(() => {
    // if this isnt a color and is an empty string, the global app
    // context is set, but since theres a higher div with a fallback
    // color as the default, still looks like everything works
    setBackgroundColor(ctx.setContext, bgColor);
  }, [bgColor]);

  return (
    <div className="customize-body">
      <div className="description">Set the background color!</div>
      <PaintControls
        initialColor={ctx.backgroundColor}
        setCurrentColor={setBgColor}
      />
    </div>
  );
};
