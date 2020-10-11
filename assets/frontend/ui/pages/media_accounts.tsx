import React from "react";
import { setWindowMsg } from "./home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { MediaElsewhere, LinkInfo } from "../../data";
import { launchWindowFunc } from "./actions";

const minHeight = 200;
const minWidth = 320;

export function MediaAccountsWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const mediaWidth = browserWidth * 0.2;
    const mediaHeight = browserHeight * 0.2;
    const windowId = Date.now().toString();
    const mediaDialog = (
      <>
        <Dialog
          /* average af the center - minWidth and center - windowWidth
           * seems to work well for this window size on both mobile/desktop */
          x={(x - minWidth + (x - mediaWidth / 2)) / 2}
          y={Math.max(y - minHeight, y - mediaHeight / 2)}
          width={mediaWidth}
          height={mediaHeight}
          minHeight={minHeight}
          minWidth={minWidth}
          title="media accounts"
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <div className="media-accounts">
            {MediaElsewhere.map((el: LinkInfo) => (
              <div key={el.name}>
                <span>
                  <a href={el.url}>{el.name}</a>
                </span>
              </div>
            ))}
          </div>
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
