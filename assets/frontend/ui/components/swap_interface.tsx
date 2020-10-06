import React from "react";
import { Link } from "react-router-dom";

interface ISwapInterfaceButton {
  isGui: boolean;
  text: string;
}

const SwapInterfaceButton = ({text, isGui}: ISwapInterfaceButton) => {

  return (
    <div className="swap-interface">
      <Link to={(isGui)? "/tui": "/"}>
        {text}
      </Link>
    </div>
  );
}

export default SwapInterfaceButton;
