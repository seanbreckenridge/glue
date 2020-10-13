import React from "react";
import Home from "./home";

interface IGUI {
  backgroundColor: string;
}

const GUI = ({ backgroundColor }: IGUI) => {
  return (
    <div
      id="gui"
      className="full-screen root-el"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <Home />
    </div>
  );
};

export default GUI;
