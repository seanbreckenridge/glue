import React from "react";
// import useWindowDimensions from "./dimensions";

const TUITerminal = () => {
  return (
    <>
      <pre className="disabled-message">
        <code>
          $ the terminal is currently disabled...
        </code>
      </pre>
      <pre className="dummy-error-text">
        <code>
        {`(not a real error occurred in the <div> component):
in div (created by TUI)
in div (created by TUI)
in TUI (created by HomeScreen)
in Route (created by HomeScreen)
in Switch (created by HomeScreen)
in Router (created by HashRouter)
in HashRouter (created by HomeScreen)
in HomeScreen (created by Computer)
in AppContextProvider (created by Computer)
in Computer
<anonymous> react.js:4
js app.js:121
__webpack_require__ app.js:20
0 app.js:907
__webpack_require__ app.js:20
<anonymous> app.js:84
<anonymous> app.js:87`}
        </code>
      </pre>
    </>
  )
};
export default TUITerminal;
