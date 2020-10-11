import React from "react";
import { setWindowMsg } from "./home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { LinkInfo } from "../../data";
import { launchWindowFunc } from "./actions";

const linkLineHeight = 30;
const defaultMinWidth = 320;

interface ILinkWindow {
  setwMsg: setWindowMsg;
  links: LinkInfo[];
  title: string;
  minWidth?: number;
  minHeight?: number;
}

export function LinkWindow(props: ILinkWindow): launchWindowFunc {
  const minWidth = props.minWidth ?? defaultMinWidth;
  const minHeight = props.minHeight ?? props.links.length * linkLineHeight;
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const linkWidth = browserWidth * 0.2;
    const linkHeight = browserHeight * 0.2;
    const windowId = Date.now().toString();
    const linkDialog = (
      <>
        <Dialog
          /* average af the center - minWidth and center - windowWidth
           * seems to work well for this window size on both mobile/desktop */
          x={(x - minWidth + (x - linkWidth / 2)) / 2}
          y={Math.max(y - minHeight, y - linkHeight / 2)}
          width={linkWidth}
          height={linkHeight}
          minHeight={minHeight}
          minWidth={minWidth}
          title={props.title}
          // when close it hit, set the message to kill this window
          hitCloseCallback={() =>
            props.setwMsg({ spawn: false, windowId: windowId })
          }
        >
          <div className="linklist">
            {props.links.map((el: LinkInfo) => (
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
    props.setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: linkDialog,
    });
  };
}