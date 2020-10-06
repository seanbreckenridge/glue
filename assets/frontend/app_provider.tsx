import React, {createContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  requestAndSetCubing, requestAndSetFeed,
  requestAndSetPersonal, RCubingData, RFeedData, RPersonalData
} from "./api_model";

// defines the connection with the API, exposes that context/state
// using hooks to the rest of the application

// https://stackoverflow.com/a/57908436/9348376

interface IProps {
  children?: any;
}

type Context = {
  info?: RPersonalData,
  feed?: RFeedData,
  cubing?: RCubingData,
  // setContext: Dispatch<SetStateAction<Context>>;
  setContext: setContextFunc,
};

type setContextFunc = Dispatch<SetStateAction<Context>>;

const initialContext: Context = {
  setContext: (): void => {
    throw new Error('setContext function must be overridden');
  },
};

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
}
