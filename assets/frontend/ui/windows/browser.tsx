import React, { useState } from "react";
import { setWindowMsg } from "./../home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { fullScreenDialogScale, launchWindowFunc } from "./actions";

const minHeight = 400;
const minWidth = 300;

export function BrowserWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const dialogWidth = browserWidth * fullScreenDialogScale;
    const dialogHeight = browserHeight * fullScreenDialogScale;
    const windowId = Date.now().toString();
    const dialogObj = (
      <>
        <Dialog
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="browser"
          windowId={windowId}
          minHeight={minHeight}
          disableBodyDragging={true}
          minWidth={minWidth}
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <Browser />
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

const defaultURL = "https://www.youtube.com/embed/8xeBGx2bfxc";

const Browser = () => {
  const [formUrl, setFormUrl] = useState<string>(defaultURL);
  const [iframeURL, setIFrameURL] = useState<string>(defaultURL);

  return (
    <div className="browser-body">
      <div className="browser-controls">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // prepend http if needed
            let httpUrl: string = (" " + formUrl).slice(1); // deep copy
            if (!httpUrl.startsWith("http")) {
              httpUrl = "http://" + httpUrl;
            }
            setIFrameURL(httpUrl);
          }}
        >
          <input
            type="text"
            name="url"
            value={formUrl}
            onChange={(e) => {
              setFormUrl(e.target.value);
            }}
          />
          <input className="pixel" type="submit" value="GO" />
        </form>
      </div>
      <div className="iframe-wrapper">
        <iframe src={iframeURL}> </iframe>
      </div>
    </div>
  );
};
