import React from "react";
import Home from "./pages/home";

const GUI: React.FC<{}> = () => {
  return (
    <div id="gui" className="full-screen root-el">
      <Home />
    </div>
  );
};

export default GUI;
