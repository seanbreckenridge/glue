import React, { useEffect, Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import DesktopIcon from "./../components/desktop_icon";
import Dialog from "../components/dialog";
import Feed from "./feed";
import Cubing from "./cubing";
import { LinkInfo, Data, MediaElsewhere } from "../../data";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";

// custom pages implemeneted in react
interface IHashActionFunc {
  // weird that page is needed here
  [page: string]: Function;
}

const fullScreenDialogScale = 0.75;

// create a closure around the state. could probably also
// be done with useContext, but this works
//
// returns a function which receieves the message interface
// as an argument,  which returns the function that launches this onClick
// action (open the dialog, does something on the page)
const overWriteActions: IHashActionFunc = {
  "Media Feed": (setwMsg: setWindowMsg) => {
    return () => {
      const { browserWidth, browserHeight } = getWindowDimensions();
      const { x, y } = jitterCenterLocation();
      const feedDialogWidth = browserWidth * fullScreenDialogScale;
      const feedDialogHeight = browserHeight * fullScreenDialogScale;
      const windowId = Date.now().toString();
      const feedDialog = (
        <>
          <Dialog
            isErr={false}
            x={x - feedDialogWidth / 2}
            y={y - feedDialogHeight / 2}
            width={feedDialogWidth}
            height={feedDialogHeight}
            title="media feed"
            // when close it hit, set the message to kill this window
            hitCloseCallback={() =>
              setwMsg({ spawn: false, windowId: windowId })
            }
          >
            <Feed />
          </Dialog>
        </>
      );
      // when the icon is clicked, set the message to spawn this window
      setwMsg({
        spawn: true,
        windowId: windowId,
        windowObj: feedDialog,
      });
    };
  },
  Cubing: (setwMsg: setWindowMsg) => {
    return () => {
      const { browserWidth, browserHeight } = getWindowDimensions();
      const { x, y } = jitterCenterLocation();
      const cubingDialogWidth = browserWidth * fullScreenDialogScale;
      const cubingDialogHeight = browserHeight * fullScreenDialogScale;
      const windowId = Date.now().toString();
      const cubingDialog = (
        <>
          <Dialog
            isErr={false}
            x={x - cubingDialogWidth / 2}
            y={y - cubingDialogHeight / 2}
            width={cubingDialogWidth}
            height={cubingDialogHeight}
            title="cubing"
            // when close it hit, set the message to kill this window
            hitCloseCallback={() =>
              setwMsg({ spawn: false, windowId: windowId })
            }
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
  },
  "Me Elsewhere": (setwMsg: setWindowMsg) => {
    return () => {
      const { browserWidth, browserHeight } = getWindowDimensions();
      const { x, y } = jitterCenterLocation();
      const mediaWidth = browserWidth * 0.5;
      const mediaHeight = browserHeight * 0.5;
      const windowId = Date.now().toString();
      const mediaDialog = (
        <>
          <Dialog
            isErr={false}
            x={x - mediaWidth / 2}
            y={y - mediaHeight / 2}
            width={mediaWidth}
            height={mediaHeight}
            title="media elsewhere"
            // when close it hit, set the message to kill this window
            hitCloseCallback={() =>
              setwMsg({ spawn: false, windowId: windowId })
            }
          >
            <h4>{JSON.stringify(MediaElsewhere)}</h4>
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
  },
};

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

// returns what this icon does when its clicked
function getAction(el: LinkInfo, setwMsg: setWindowMsg): Function {
  const action: Function = overWriteActions[el.name];
  if (action !== undefined) {
    // create the closure so that actions have
    // access to the set window message functions
    return action(setwMsg);
  } else if (el.url !== undefined && el.url !== "") {
    return () => {
      // (reloads the page, to an external URL)
      window.location.href = el.url!;
    };
  }
  throw Error("Could not find an appropriate action for " + JSON.stringify(el));
}

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
  const [wMsg, setwMsg] = useState(windowMsgDefault);

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
    <div id="home-icons-window-wrapper">
      <>
        {Object.keys(guiWindows).map((wid) => (
          <div key={wid.toString()}>{guiWindows[wid]}</div>
        ))}
      </>
      <div id="home-icons-container">
        {Data.map((el) => (
          <div
            key={el.name}
            className={clsx("home-icon", selectedIcon == el.name && "selected")}
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
  );
}

export default Home;
