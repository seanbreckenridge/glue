import React from "react";
import {
  Switch,
  Route,
  Link,
  HashRouter
} from "react-router-dom";
import Cubing from "./components/cubing";
import Feed from "./components/feed";
import SwapInterfaceButton from "./components/swap_interface";
import {AppContextConsumer, Context} from "../app_provider";
import {RPersonalData, PersonalData} from "../api_model";
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
          <AppContextConsumer>
            {(value: Context) => {
              return (
                <HashRouter>
                  <Switch>
                    <Route path="/cubing">
                      <Cubing />
                    </Route>
                    <Route path="/feed">
                      <Feed />
                    </Route>
                    <Route path="/">
                      <>
                        {/* Default home screen */}
                        <HomeIcons data={value.info} />
                      </>
                    </Route>
                  </Switch>
                </HashRouter>
              );
            }}
          </ AppContextConsumer>
        </div>
      </div>
    </>
  );
};

interface IHomeIconsProps {
  data: Unset<RPersonalData>;
}

function HomeIcons(props: IHomeIconsProps) {
  // while request is loading/we dont have data (is undefined/null)
  if (!some(props.data)) {
    return <h3>Loading...</h3>
  }
  // check that the request finished properly (is not error)
  if (!ok(props.data)) {
    return <h3 style={{color: 'red'}}>Error</h3>
  }
  return (
    <>
      {(props.data as PersonalData).here.map((hInfo) =>
        <div key={hInfo.name}>
          <a className="here icon-link" href={hInfo.url}>
            {hInfo.name}
          </a>
        </div>
      )}
      <br />
      {(props.data as PersonalData).elsewhere.map((eInfo) =>
        <div key={eInfo.name}>
          <img src={eInfo.image!} alt={eInfo.name} />
          <a className="here icon-link" href={eInfo.url}>
            {eInfo.name}
          </a>
        </div>
      )}
    </>
  );
}


export default GUI;
