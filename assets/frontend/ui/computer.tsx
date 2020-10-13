import React from "react";
import {
  AppContextProvider,
  Context,
  AppContextConsumer,
} from "../app_provider";
import GUI from "./gui";

// top level of interface
// renders the the initial loading screen, makes requests off to APi
const Computer: React.FC<{}> = () => {
  return (
    <>
      <AppContextProvider>
        <HomeScreen />
      </AppContextProvider>
    </>
  );
};

// TODO: add loading animation
export const HomeScreen: React.FC<{}> = () => {
  return (
    <AppContextConsumer>
      {(value: Context) => {
        return <GUI backgroundColor={value.backgroundColor} />;
      }}
    </AppContextConsumer>
  );
};

export default Computer;
