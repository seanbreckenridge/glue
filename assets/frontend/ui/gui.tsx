import React from "react";
import {Link} from "react-router-dom";
import SwapInterfaceButton from "./components/swap_interface";
import {AppContextConsumer, Context} from "../app_provider";
import {PersonalData} from "../api_model";
import DesktopIcon from "./components/desktop_icon";
import {some, ok} from "../utils";

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

const HomeDesktopBody = () => {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <>
              {(!some(value.info)) ?
                <>
                  <h3>Loading...</h3>
                </>
                :
                !(ok(value.info)) ?
                  <>
                    <h3>Error...</h3>
                  </>
                  :
                  <HomeIcons data={value.info as PersonalData} />
              }
            </>
          )
        }}
      </AppContextConsumer>
    </>
  )
}

interface IHomeIcons {
  data: PersonalData;
}

const HomeIcons = ({data}: IHomeIcons) => {
  return (
    <div className="home-icons-container">
      {data.here.map((el) =>
        <div key={el.name} className="home-icon">
          <DesktopIcon caption={el.name} iconurl={el.image ?? 'https://sean.fish/favicon.ico'} />
        </div>
      )}
      < br />
      {data.elsewhere.map((el) =>
        <div key={el.name} className="home-icon">
          <DesktopIcon caption={el.name} iconurl={el.image ?? 'https://sean.fish/favicon.ico'} />
        </div>
      )}
    </div>
  )
}

export default GUI;
