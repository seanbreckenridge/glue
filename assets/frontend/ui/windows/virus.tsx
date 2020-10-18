import React, { useState } from "react";

import { setWindowMsg } from "./../home";
import { getWindowDimensions, Point } from "./../components/dimensions";
import Dialog from "../components/dialog";
import { launchWindowFunc } from "./actions";

const minHeight = 150;
const minWidth = 300;

const windowBuffer = 20;

function randInt(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomLocation(
  browserWidth: number,
  browserHeight: number,
  dialogHeight: number,
  dialogWidth: number
): Point {
  const minX = windowBuffer;
  const minY = windowBuffer;
  const maxX = browserWidth - dialogWidth * 1.5;
  const maxY = browserHeight - dialogHeight * 1.7;
  return {
    x: randInt(minX, maxX),
    y: randInt(minY, maxY),
  };
}

export function VirusWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = randomLocation(
      browserWidth,
      browserHeight,
      minHeight,
      minWidth
    );
    const windowId = Date.now().toString();
    const vTitle = <VirusTitle />;
    const virusDialog = (
      <>
        <Dialog
          x={x}
          y={y}
          width={minWidth}
          height={minHeight}
          minHeight={minHeight}
          minWidth={minWidth}
          title="virus"
          windowId={windowId}
          // when close is hit, spawn another virus!
          hitCloseCallback={() => VirusWindow(setwMsg)()}
          titleObj={vTitle}
        >
          <VirusBody />
        </Dialog>
      </>
    );
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: virusDialog,
    });
    // setTimeout to spawn another one!
    setTimeout(() => {
      VirusWindow(setwMsg)();
    }, randInt(10000, 20000));
  };
}

const VirusBody = () => {
  const [clicked, setClicked] = useState<number>(0);

  const incrementClicked = () => {
    setClicked((old) => {
      return old + 1;
    });
  };

  return (
    <>
      <div className="virus-body">
        <div className="virus-text">You've clicked OK {clicked} times</div>
        <a
          href="#"
          className="input-go pixel unlinkify"
          onClick={incrementClicked}
          onTouchEnd={incrementClicked}
        >
          OK
        </a>
      </div>
    </>
  );
};

const VirusTitle = React.memo(() => {
  return (
    <div className="virus-title dialog-title-text pixel">
      <span className="vt-v">V</span>
      <span className="vt-i">i</span>
      <span className="vt-r">r</span>
      <span className="vt-u">u</span>
      <span className="vt-s">s</span>
    </div>
  );
});
