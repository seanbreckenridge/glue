import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  AppContextProvider,
  Context,
  AppContextConsumer,
} from "../app_provider";
import GUI from "./gui";
import unix from "dayjs";

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

const d = unix();

const loadingText: string[] = [
  "Loading...",
  "---------------",
  "sean.fishOS",
  "---------------",
  "Devices",
  "---------------",
  `Language .... ${navigator.language ?? "en"}`,
  `Date Now .... ${d.format("YYYY-MM-DD")}`,
  "Network ..... Pass",
  "Backend ..... Pass",
  "Frontend .... Pass",
  "---------------",
  "BOOTLOADED",
];

const loadingTextLength = loadingText.length;
const frameDuration = 150;
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
          // include gui/full-screen root-el wrapper div here (otherwise included
          // in GUI) so that loading text has the same border as the loaded screen
          return (
            <div id="gui" className="full-screen root-el">
              <div className="loading-text pixel">
                {loadingText.map((line: string, index: number) => {
                  return <div key={index}>{loading >= index ? line : ""}</div>;
                })}
              </div>
            </div>
          );
        }
      }}
    </AppContextConsumer>
  );
};

export default Computer;
