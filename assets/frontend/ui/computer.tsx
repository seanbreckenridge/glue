import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
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

const loadingText: string[] = [
  "Loading...",
  "---------------",
  "sean.fish",
  "---------------",
  "Devices",
  "   Unit 0 - Backend API ... DONE",
  "   Unit 1 - Frontend Assets ... DONE",
  "---------------",
  "BOOTLOADED",
];

const loadingTextLength = loadingText.length;
const frameDuration = 200;
const lastFrameDuration = 1000;

function renderFrame(
  currentFrame: number,
  setLoadingFunc: Dispatch<SetStateAction<number>>
): void {
  // there are still frames to render
  if (currentFrame < loadingTextLength) {
    setLoadingFunc((oldFrame) => {
      return oldFrame + 1;
    });
    // for the last setTimeout, wait longer so that the user
    // can read the loading text a bit
    setTimeout(
      () => {
        renderFrame(currentFrame + 1, setLoadingFunc);
      },
      currentFrame == loadingTextLength - 2 ? lastFrameDuration : frameDuration
    );
  }
}

export const HomeScreen: React.FC<{}> = () => {
  const [loading, setLoading] = useState<number>(0);

  useEffect(() => {
    renderFrame(loading, setLoading);
  }, []);

  return (
    <AppContextConsumer>
      {(value: Context) => {
        if (loading >= loadingTextLength) {
          // animation is over
          return <GUI backgroundColor={value.backgroundColor} />;
        } else {
          return (
            <div className="loading-text pixel">
              {loadingText.map((line: string, index: number) => {
                return <div key={index}>{loading >= index ? line : ""}</div>;
              })}
            </div>
          );
        }
      }}
    </AppContextConsumer>
  );
};

export default Computer;
