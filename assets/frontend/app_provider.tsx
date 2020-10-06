import React, {createContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  requestAndSetCubing, requestAndSetFeed,
  requestAndSetPersonal, RCubingData, RFeedData, RPersonalData
} from "./api_model";

// https://stackoverflow.com/questions/58193424/passing-state-with-usecontext-in-typescript

interface IProps {
  children?: any;
}

type UIOptions = {
  gui: boolean;
}

type Context = {
  opts: UIOptions,
  info?: RPersonalData,
  feed?: RFeedData,
  cubing?: RCubingData,
  // setContext: Dispatch<SetStateAction<Context>>;
  setContext: setContextFunc,
};

type setContextFunc = Dispatch<SetStateAction<Context>>;

const initialContext: Context = {
  opts: { gui: true },
  setContext: (): void => {
    throw new Error('setContext function must be overridden');
  },
};

// swaps from GUI to TUI or back from TUI to GUI
function swapInterfaceType(ctx: Context): void {
  ctx.setContext({
    ...ctx,
    opts: {
      ...ctx.opts,
      gui: !ctx.opts.gui,
    }
  });
}

const AppContext = createContext<Context>(initialContext);

const AppContextProvider = ({ children }: IProps): JSX.Element => {
  const [contextState, setContext] = useState<Context>(initialContext);

  // request all data from the API in the background
  // providers wait till they load using the Consumer
  // whenever requests are done
  const loadData = async () => {
    requestAndSetCubing(setContext);
    requestAndSetPersonal(setContext);
    requestAndSetFeed(setContext);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppContext.Provider value={{ ...contextState, setContext }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContextConsumer = AppContext.Consumer;

export {
  Context,
  AppContext,
  AppContextProvider,
  AppContextConsumer,
  setContextFunc,
  swapInterfaceType,
};

