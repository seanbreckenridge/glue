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
  requestAndSetComments,
  RCubingData,
  RFeedData,
  RGuestBookComments,
} from "./api_model";

// defines the connection with the API, exposes that context/state
// using hooks to the rest of the application

// https://stackoverflow.com/a/57908436/9348376

interface IProps {
  children?: any;
}

type Context = {
  feed?: RFeedData;
  cubing?: RCubingData;
  comments?: RGuestBookComments;
  // hard to model this without making it 'global',
  // as windows get launched from closures with different function aritys
  selectedWindow?: string;
  backgroundColor: string;
  // setContext: Dispatch<SetStateAction<Context>>;
  setContext: setContextFunc;
};

type setContextFunc = Dispatch<SetStateAction<Context>>;
const defaultBackgroundColor = "#222";

const initialContext: Context = {
  backgroundColor: defaultBackgroundColor,
  setContext: (): void => {
    throw new Error("setContext function must be overridden");
  },
};

const setSelectedWindow = (setCtx: setContextFunc, windowId?: string) => {
  setCtx(
    (oldData: Context): Context => {
      return {
        ...oldData,
        selectedWindow: windowId,
      };
    }
  );
};

const setBackgroundColor = (
  setCtx: setContextFunc,
  backgroundColor: string
) => {
  setCtx(
    (oldData: Context): Context => {
      return {
        ...oldData,
        backgroundColor: backgroundColor,
      };
    }
  );
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
    requestAndSetComments(setContext);
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
  setBackgroundColor,
};
