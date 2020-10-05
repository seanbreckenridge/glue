import React, { createContext, useState } from "react";

interface UIContext {
  gui: boolean;
}

// global context, options for the interface
const ctxt = createContext<UIContext | null>(null);

export const AppContextProvider = ctxt.Provider;
export const AppContextConsumer = ctxt.Consumer;

const Layout: React.FunctionComponent = (props) => {

  const [UI, setUI] = useState<UIContext>({
    gui: true,
  });

  return (
    <AppContextProvider value={UI}>
      {props.children}
    </AppContextProvider>
  );
}

export default Layout;
