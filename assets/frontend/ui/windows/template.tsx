// this isnt used for any page, its the file I copy/paste when starting a new window
import React from "react";
import {setWindowMsg} from "./../home";
import {
  jitterCenterLocation
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import {launchWindowFunc} from "./actions";

const minHeight = 150;
const minWidth = 250;

export function Window(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const {x, y} = jitterCenterLocation();
    const windowId = Date.now().toString();
    const dialogObj = (
      <>
        <Dialog
          x={x - minWidth / 2}
          y={y - minHeight / 2}
          width={minWidth}
          height={minHeight}
          title="title"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({spawn: false, windowId: windowId})}
        >
          <Body />
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


const Body = () => {
  return (
    <>
    </>
  )
};
