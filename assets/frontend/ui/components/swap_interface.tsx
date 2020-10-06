import React from "react";
import {Link} from "react-router-dom";

interface ISwapInterfaceButton {
  isGui: boolean;
  text: string;
}

const SwapInterfaceButton = ({text, isGui}: ISwapInterfaceButton) => {

  return (
    <div className="swap-interface">
      <button className="swap-button">
        <Link to={(isGui) ? "/tui" : "/"} className="swap-link">
          {text}
        </Link>
      </button>
    </div>
  );
}

export default SwapInterfaceButton;
