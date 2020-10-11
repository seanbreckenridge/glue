import React, {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  requestAndSetCubing,
  requestAndSetFeed,
  RCubingData,
  RFeedData,
} from "./api_model";
import { some } from "./utils";

// defines the connection with the API, exposes that context/state
// using hooks to the rest of the application

// https://stackoverflow.com/a/57908436/9348376

interface IProps {
  children?: any;
}

type Context = {
  feed?: RFeedData;
  cubing?: RCubingData;
  // hard to model this without making it 'global',
  // as windows get launched from closures with different function aritys
  selectedWindow?: string;
  // setContext: Dispatch<SetStateAction<Context>>;
  setContext: setContextFunc;
};

type setContextFunc = Dispatch<SetStateAction<Context>>;

const initialContext: Context = {
  setContext: (): void => {
    throw new Error("setContext function must be overridden");
  },
};

const setSelectedWindow = (setCtx: setContextFunc, windowId?: string) => {
  if (some(windowId)) {
    setCtx(
      (oldData: Context): Context => {
        return {
          ...oldData,
          selectedWindow: windowId,
        };
      }
    );
  }
};

const AppContext = createContext<Context>(initialContext);

const AppContextProvider = ({ children }: IProps): JSX.Element => {
  const [contextState, setContext] = useState<Context>(initialContext);

  // request all data from the API in the background
  // providers wait till they load using the Consumer
  // whenever requests are done
  const loadData = async () => {
    requestAndSetCubing(setContext);
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
  setSelectedWindow,
};
