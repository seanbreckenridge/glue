import React from "react";
import {Link} from "react-router-dom";

interface ISwapInterfaceButton {
  isGui: boolean;
  text: string;
}

const SwapInterfaceButton = ({text, isGui}: ISwapInterfaceButton) => {

  return (
    <div className="swap-interface">
      <div className="swap-button menu-bar-item">
        <Link to={(isGui) ? "/tui" : "/"} className="swap-link">
          {text}
        </Link>
      </div>
    </div>
  );
}

export default SwapInterfaceButton;
