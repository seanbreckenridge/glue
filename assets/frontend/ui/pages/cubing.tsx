import React from "react";
import { Context, AppContextConsumer } from "../../app_provider";
import WrapApiError from "../components/wrap_api_error";
import { setWindowMsg } from "./home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { fullScreenDialogScale } from "./actions";

export function CubingWindow(setwMsg: setWindowMsg): Function {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const cubingDialogWidth = browserWidth * fullScreenDialogScale;
    const cubingDialogHeight = browserHeight * fullScreenDialogScale;
    const windowId = Date.now().toString();
    const cubingDialog = (
      <>
        <Dialog
          x={x - cubingDialogWidth / 2}
          y={y - cubingDialogHeight / 2}
          width={cubingDialogWidth}
          height={cubingDialogHeight}
          title="cubing"
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <Cubing />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: cubingDialog,
    });
  };
}

export default function Cubing() {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.cubing}>
              <div>{JSON.stringify(value.cubing)}</div>
            </WrapApiError>
          );
        }}
      </AppContextConsumer>
    </>
  );
}
