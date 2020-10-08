import React, { useEffect, Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import DesktopIcon from "./../components/desktop_icon";
import { Link } from "react-router-dom";
import SwapInterfaceButton from "./../components/swap_interface";
import { getAction } from "./actions";
import { IconData } from "../../data";

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
        <SwapInterfaceButton text="Switch to Terminal" isGui={true} />
      </div>
      <div id="window-body">
        <div id="desktop-body">
          <div id="home-icons-window-wrapper">
            <>
              {Object.keys(guiWindows).map((wid) => (
                <div key={wid.toString()}>{guiWindows[wid]}</div>
              ))}
            </>
            <div id="home-icons-container">
              {IconData.map((el) => (
                <div
                  key={el.name}
                  className={clsx(
                    "home-icon",
                    selectedIcon == el.name && "selected"
                  )}
                >
                  <DesktopIcon
                    click={getAction(el, setwMsg)}
                    mouseEnter={() => setSelectedIcon(el.name)}
                    mouseLeave={() => setSelectedIcon("")} // set to empty string, which means nothing is highlighted
                    caption={el.name}
                    iconurl={el.icon ?? "https://sean.fish/favicon.ico"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
