import React, { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import SwapInterfaceButton from "./components/swap_interface";
import { AppContextConsumer, Context } from "../app_provider";
import { PersonalData } from "../api_model";
import Home from "./pages/home";
import WrapApiError from "./components/wrap_api_error";

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
          <DesktopBody />
        </div>
      </div>
    </>
  );
};

type selectedIconType = string;
const selectedIconDefault = "";
export type setIconFunc = Dispatch<SetStateAction<selectedIconType>>;

const DesktopBody = () => {
  // what icon the user currently has clicked/highlighted
  // use the icon caption as the key
  const [selectedIcon, setSelectedIcon] = useState(selectedIconDefault);

  return (
    <div id="desktop-body">
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.info}>
              <Home
                data={value.info as PersonalData}
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
              />
            </WrapApiError>
          );
        }}
      </AppContextConsumer>
    </div>
  );
};

export default GUI;
