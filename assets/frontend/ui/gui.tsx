import React, {Dispatch, SetStateAction, useState} from "react";
import {Link} from "react-router-dom";
import SwapInterfaceButton from "./components/swap_interface";
import {AppContextConsumer, Context} from "../app_provider";
import {PersonalData} from "../api_model";
import HomeIcons from "./components/home_icons";
import DesktopErrorDialog from "./components/desktop_error_dialog";
import WhatDoNow from "./components/what_do_now";
import {some, errored} from "../utils";

const GUI: React.FC<{}> = () => {
  return (
    <>
      <div id="gui" className="full-screen root-el">
        <div id="menu-bar">
          <div className="menu-toolbar-item menu-bar-item">
            <Link className="unlinkify" to="/">
              sean
            </Link>
          </div>
          <SwapInterfaceButton text="Switch to Terminal" isGui={true} />
        </div>
        <div id="window-body">
          <HomeDesktopBody />
        </div>
      </div>
    </>
  )
};

type selectedIconType = string;
const selectedIconDefault = "";
export type setIconFunc = Dispatch<SetStateAction<selectedIconType>>;


const HomeDesktopBody = () => {
  // If there was an API error displaying the home page info,
  // whether or not the user clicked the 'x' button
  const [userClosedError, setUserClosedError] = useState(false);

  // what icon the user currently has clicked/highlighted
  // use the icon caption as the key
  const [selectedIcon, setSelectedIcon] = useState(selectedIconDefault);

  return (
    <div id="desktop-body">
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <>
              {(!some(value.info))
                ? <h3>Loading...</h3>
                : (errored(value.info))
                  // if there was an API error
                  ? (!userClosedError)
                    // If the user hasn't hit the 'x' button in the dialog
                    ? <DesktopErrorDialog
                      msg="Error fetching data..."
                      err={value.info as Error}
                      closeDialog={() => setUserClosedError(true)} />
                    : <WhatDoNow />
                  // everything loaded fine
                  : <HomeIcons data={value.info as PersonalData} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />
              }
            </>
          )
        }}
      </AppContextConsumer>
    </div>
  )
}


export default GUI;
