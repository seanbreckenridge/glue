import React, { useRef, useEffect, useCallback } from "react";

import { setWindowMsg } from "./../home";
import { getWindowDimensions, Point } from "./../components/dimensions";
import Dialog from "../components/dialog";
import { launchWindowFunc } from "./actions";
import { randomColor } from "./paint";

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
          <VirusBodyMemo height={minHeight} width={minWidth} />
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

interface VirusBodyProps {
  height: number;
  width: number;
}

const createMatrix = (xc: number, yc: number) => {
  // manually create a matrix of colors
  const matrix = new Array<Array<string>>(yc);
  for (let y = 0; y < yc; y++) {
    matrix[y] = new Array<string>(xc);
    for (let x = 0; x < xc; x++) {
      matrix[y][x] = randomColor();
    }
  }
  return matrix;
};

const createMatrixRefs = (xc: number, yc: number) => {
  // create a matrix of refs
  const matrix = new Array<Array<React.RefObject<HTMLDivElement>>>(yc);
  for (let y = 0; y < yc; y++) {
    matrix[y] = new Array<React.RefObject<HTMLDivElement>>(xc);
    for (let x = 0; x < xc; x++) {
      matrix[y][x] = React.createRef<HTMLDivElement>();
    }
  }
  return matrix;
};

const VirusBody = ({ height, width }: VirusBodyProps) => {
  const xc = useRef<number>(Math.ceil(width / 10) + 2);
  const yc = useRef<number>(Math.ceil(height / 10) + 2);
  const matrixColors = useRef<Array<Array<string>>>(
    createMatrix(xc.current, yc.current)
  );
  const matrixRefs = useRef<Array<Array<React.RefObject<HTMLDivElement>>>>(
    createMatrixRefs(xc.current, yc.current)
  );

  const randomizeMatrix = useCallback(() => {
    for (let y = 0; y < yc.current; y++) {
      for (let x = 0; x < xc.current; x++) {
        matrixColors.current[y][x] = randomColor();
        if (matrixRefs.current[y][x].current) {
          matrixRefs.current[y][x].current!.style.backgroundColor =
            randomColor();
        }
      }
    }
  }, [xc, yc]);

  useEffect(() => {
    // fire off the first randomize
    randomizeMatrix();
    // set an interval to randomize the matrix every 1-2 seconds
    const interval = setInterval(() => {
      randomizeMatrix();
    }, randInt(1000, 2000));
    return () => clearInterval(interval);
  }, []);

  // create a flexbox with rows 10 pixels wide and high
  return (
    <div
      className="virus-body"
      style={{
        height: height + 20,
        width: width + 20,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: yc.current }, (_, y) => {
        return (
          <div
            key={y}
            className="virus-row"
            style={{ display: "flex", flexDirection: "row" }}
          >
            {Array.from({ length: xc.current }, (_, x) => {
              return (
                <div
                  key={x}
                  ref={matrixRefs.current[y][x]}
                  className="virus-pixel"
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const VirusBodyMemo = React.memo(VirusBody);

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
