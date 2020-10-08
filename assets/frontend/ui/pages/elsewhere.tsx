import React from "react";
import { setWindowMsg } from "./home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { MediaElsewhere } from "../../data";

export function ElseWhereWindow(setwMsg: setWindowMsg): Function {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const mediaWidth = browserWidth * 0.5;
    const mediaHeight = browserHeight * 0.5;
    const windowId = Date.now().toString();
    const mediaDialog = (
      <>
        <Dialog
          x={x - mediaWidth / 2}
          y={y - mediaHeight / 2}
          width={mediaWidth}
          height={mediaHeight}
          title="media elsewhere"
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <h4>{JSON.stringify(MediaElsewhere)}</h4>
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: mediaDialog,
    });
  };
}
