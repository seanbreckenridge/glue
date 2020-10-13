import React, { useState, useRef } from "react";
import { setWindowMsg } from "./../home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import TapLink from "../components/taplink";
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

const defaultURL = "https://en.wikipedia.org/wiki/Special:Random";

const Browser = () => {
  const [formUrl, setFormUrl] = useState<string>(defaultURL);
  const [iframeURL, setIFrameURL] = useState<string>(defaultURL);
  const textField = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    // prepend http if needed
    let httpUrl: string = (" " + formUrl).slice(1); // deep copy
    if (!httpUrl.startsWith("http")) {
      httpUrl = "http://" + httpUrl;
    }
    setIFrameURL(httpUrl);
  };

  return (
    <div className="browser-body">
      <div className="browser-controls">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            ref={textField}
            onTouchEnd={() => {
              textField.current!.focus();
            }} // for mobile
            type="text"
            name="url"
            value={formUrl}
            onChange={(e: any) => {
              setFormUrl(e.target.value);
            }}
          />
          <a
            href="#"
            className="browser-go pixel unlinkify"
            onTouchEnd={handleSubmit}
            onClick={handleSubmit}
          >
            Go
          </a>
          {/* so that ctrl enter works */}
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
      <div className="iframe-wrapper">
        <iframe src={iframeURL}> </iframe>
      </div>
    </div>
  );
};
