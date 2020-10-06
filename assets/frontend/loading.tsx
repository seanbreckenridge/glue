import React, {createContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  requestAndSetCubing, requestAndSetFeed,
  requestAndSetPersonal, RCubingData, RFeedData, RPersonalData
} from "./api_model";

interface UIOptions {
  gui: boolean;
}

export interface UIData {
  opts: UIOptions;
  info?: RPersonalData;
  feed?: RFeedData;
  cubing?: RCubingData;
}

// global context, options for the interface
const ctxt = createContext<UIData | null>(null);

export const UIDataProvider = ctxt.Provider;
export const UIDataConsumer = ctxt.Consumer;

export type setDataFunc = Dispatch<SetStateAction<UIData>>

const Loading: React.FunctionComponent = (props) => {

  const [data, setData]: [UIData, setDataFunc] = useState<UIData>({
    opts: {
      gui: true,
    },
  });


  // request all data from the API in the background
  // providers wait till they load using the Consumer
  // whenever requests are done
  const loadData = async () => {
    requestAndSetCubing(setData);
    requestAndSetPersonal(setData);
    requestAndSetFeed(setData);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <UIDataProvider value={data}>
      <main>
        {props.children}
      </main>
    </UIDataProvider>
  );
}

export default Loading;
