import React, { useEffect, Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import DesktopIcon from "./../components/desktop_icon";
import { Link } from "react-router-dom";
// import SwapInterfaceButton from "./../components/swap_interface";
import { getAction, launchWindowFunc } from "./actions";
import { IconData } from "../../data";
import { getWindowDimensions } from "./../components/dimensions";

// represents the current windows on the screen
// windowId is epoch time/some unique integer
// as a string
interface IWindowMap {
  [windowId: string]: any;
}

// start with no windows
const windowDefault: IWindowMap = {};
export type setWindowFunc = Dispatch<SetStateAction<IWindowMap>>;

// represents a message from an icon to the state
// these messages cause windows to spawn/kill(close)
interface _windowMsg {
  spawn: boolean; // opposite of spawn is kill, removes the windowId
  windowId: string;
  windowObj?: any;
}

type windowMsg = _windowMsg | undefined;
const windowMsgDefault: windowMsg = undefined;
export type setWindowMsg = Dispatch<SetStateAction<windowMsg>>;

function removeWindow(
  windows: IWindowMap,
  excludeWindowId: string
): IWindowMap {
  const newWindows: IWindowMap = {};
  Object.keys(windows).forEach((wId) => {
    if (wId !== excludeWindowId) {
      newWindows[wId] = windows[wId];
    }
  });
  return newWindows;
}

// rectangles the user can draw on the screen
interface _draggedRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  browserWidth: number;
  browserHeight: number;
}
type draggedRect = _draggedRect | undefined;
const draggedRectDefault = undefined;
const dragBuffer = 3; // to make sure nothing weird happens with scrollbar, keep a small buffer

function Home() {
  // currently displayed floating windows
  const [guiWindows, setWindows] = useState(windowDefault);

  // state which acts sort of like a message interface for spawning/killing gui windows
  // this is needed because the getAction defines a closure, so it doesn't
  // have access to the current state of gui windows is
  // when windows are created, they set themself here, and then are
  // added using setWindows in this scope. If they're to be killed, they
  // add the object with spawn: false; and they're filtered out of the window list
  const [wMsg, setwMsg]: [windowMsg, setWindowMsg] = useState(windowMsgDefault);

  // what icon the user currently has clicked/highlighted
  // use the icon caption as the key
  const [selectedIcon, setSelectedIcon] = useState("");

  // handle window spawn/kill
  useEffect(() => {
    // if we have a new message (spawn/kill window), do something with it
    if (wMsg !== undefined) {
      // if we have a window to spawn
      if (wMsg!.spawn) {
        setWindows({
          ...guiWindows,
          // [] interpolates the value as the keyname
          [wMsg!.windowId]: wMsg.windowObj!,
        });
      } else {
        // we have a window to kill
        setWindows(removeWindow(guiWindows, wMsg!.windowId));
      }
      setwMsg(undefined);
    }
  }, [wMsg]); // only call the useEffect hook when wMsg changes

  // let the user draw rectangles on the desktop
  const [dragRect, setDragRect] = useState<draggedRect>(draggedRectDefault);

  const createRect = (x: number, y: number) => {
    const { browserHeight, browserWidth } = getWindowDimensions();
    setDragRect({
      x1: x,
      x2: x,
      y1: y,
      y2: y,
      browserHeight: browserHeight,
      browserWidth: browserWidth,
    });
  };

  const updateRect = (x: number, y: number) => {
    // bounds checking
    if (x > dragRect!.browserWidth) {
      x = dragRect!.browserWidth - 3;
    } else if (x <= 0) {
      x = dragBuffer;
    }
    if (y > dragRect!.browserHeight) {
      y = dragRect!.browserHeight - 3;
    } else if (y <= 0) {
      y = dragBuffer;
    }
    setDragRect({
      ...dragRect!,
      x2: x,
      y2: y,
    });
  };

  const deleteRect = () => {
    setDragRect(undefined);
  };

  // TODO: match against URL hash and open corresponding window?
  // TODO: on resize, 'update'? somehow the dialogs
  // so that if its off the page, it resnaps/moves to the current viewport
  return (
    <>
      <div id="menu-bar">
        <div className="menu-toolbar-item menu-bar-item">
          <Link className="unlinkify" to="/">
            sean
          </Link>
        </div>
        {/* disable TUI for now (while it doesnt exist) */}
        {/* <SwapInterfaceButton text="Switch to Terminal" isGui={true} /> */}
      </div>
      <div id="window-body">
        <div id="desktop-body">
          <div
            id="home-icons-window-wrapper"
            // capture events for drawing the rectangle
            onMouseDown={(event) => createRect(event.clientX, event.clientY)}
            onMouseMove={(event: React.DragEvent<HTMLDivElement>) => {
              if (dragRect !== undefined) {
                updateRect(event.clientX, event.clientY);
              }
            }}
            onMouseUp={(_) => deleteRect()}
            onMouseLeave={(_) => deleteRect()}
          >
            {/* dialog/windows */}
            <div id="floating-windows">
              {Object.keys(guiWindows).map((wid) => (
                <div key={wid.toString()}>{guiWindows[wid]}</div>
              ))}
            </div>
            {/* drawable rectangle */}
            {dragRect !== undefined ? <DragRect {...dragRect} /> : <></>}
            <div id="home-icons-container">
              {IconData.map((el) => {
                const action: string | launchWindowFunc = getAction(
                  el,
                  setwMsg
                );
                const isURL: boolean =
                  typeof action === "string" || action instanceof String;
                return (
                  <div
                    key={el.name}
                    className={clsx(
                      "home-icon",
                      selectedIcon == el.name && "selected"
                    )}
                  >
                    <DesktopIcon
                      url={isURL ? (action as string) : undefined}
                      click={!isURL ? (action as launchWindowFunc) : undefined}
                      mouseEnter={() => setSelectedIcon(el.name)}
                      mouseLeave={() => setSelectedIcon("")} // set to empty string, which means nothing is highlighted
                      caption={el.name}
                      iconurl={el.icon ?? "https://sean.fish/favicon.ico"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const DragRect = (props: _draggedRect) => {
  // by default, assume the user dragged down and to the right
  let topLeftX: number = props.x1;
  let topLeftY: number = props.y1;
  let height: number = props.y2 - props.y1;
  let width: number = props.x2 - props.x1;
  // if the user dragged left, x2 > x1
  if (props.x1 >= props.x2) {
    topLeftX = props.x2;
    width = props.x1 - props.x2;
  }
  // if user dragged up
  if (props.y1 >= props.y2) {
    topLeftY = props.y2;
    height = props.y1 - props.y2;
  }
  return (
    <div
      id="draggable-rect"
      style={{
        top: topLeftY,
        left: topLeftX,
        height: height,
        width: width,
      }}
    >
      <div className="draggable-rect-body"></div>
    </div>
  );
};

export default Home;
