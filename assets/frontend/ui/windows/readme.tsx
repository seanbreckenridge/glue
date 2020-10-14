import React from "react";
import { setWindowMsg } from "./../home";
import {
  jitterCenterLocation,
  getWindowDimensions,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { launchWindowFunc } from "./actions";
import TapLink from "./../components/taplink";

const minHeight = 450;
const minWidth = 250;

const readmeScale = 0.5;

export function ReadmeWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserHeight, browserWidth } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const dialogWidth = Math.max(minWidth, browserWidth * readmeScale);
    const dialogHeight = Math.max(minHeight, browserHeight * readmeScale);
    const windowId = Date.now().toString();
    const dialogObj = (
      <>
        <Dialog
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="readme"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          // when close is hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <ReadmeBody />
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

const ReadmeBody = () => {
  return (
    <div className="readme-body">
      <h3 className="hi">Hi!</h3>
      <p>Name's Sean.</p>
      <p>
        The Icons here are mostly little applications, links to other places I
        live on the internet, or some of my writing/projects.
      </p>
      <p>
        The windows here can be resized and dragged around. The top left button
        can be used to close windows; the arrows in the top right can be used to
        scroll (try in 'Media Feed').
      </p>
      <hr />
      <p>
        Other than{" "}
        <TapLink href="https://github.com/seanbreckenridge/">Github</TapLink>, I
        don't use social media that much. If you're interested in my thoughts,
        my <TapLink href="https://exobrain.sean.fish">exobrain</TapLink> has
        lots of those. Feel free to email me{" "}
        <TapLink href="mailto:ssbreckenridge@me.com">here</TapLink>. You
        can also sign the Guest Book here, I look at that every few hours.
      </p>
      <h5>Thanks for visiting!</h5>
    </div>
  );
};
