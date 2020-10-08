import React from "react";
import { Link } from "react-router-dom";
import SwapInterfaceButton from "./components/swap_interface";
import Home from "./pages/home";

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
          <div id="desktop-body">
            <Home />
          </div>
        </div>
      </div>
    </>
  );
};

export default GUI;
