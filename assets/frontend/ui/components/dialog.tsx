import React from "react";
import clsx from "clsx";
import {Rnd} from 'react-rnd';
import useWindowDimensions from "./dimensions";
import {some} from "../../utils";

interface IDialogProps {
  isErr: boolean;
  hitCloseCallback: Function;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  title?: string;
  // have to provide one of these. If msg is not
  // provided, uses children
  // If both are provided, renders message in a div.dialog-message
  // div, then the children
  msg?: string;
  children?: any;
}

const Dialog = ({children, hitCloseCallback, title, msg, isErr, width, height, x, y}: IDialogProps) => {
  // browser size
  const {browserHeight, browserWidth} = useWindowDimensions()

  const dialogWidth = width ?? 200;
  const dialogHeight = height ?? 100;

  // if values aren't provided, default is to:
  // center dialog on x axis, 1/3rd down the page on y
  // subtract half of the height/width to actually center dialog
  // (as opposed to top left corner)
  const xPos = x ?? (browserWidth / 2) - (dialogWidth / 2);
  const yPos = y ?? (browserHeight / 3) - (dialogHeight / 2);

  const dialogTitle = title ?? ((isErr) ? "ERROR" : null);

  return (
    <Rnd default={{
      x: xPos,
      y: yPos,
      width: dialogWidth,
      height: dialogHeight,
    }}
      bounds="#desktop-body"
    >
      <div className={clsx('dialog', isErr && 'error')}>
        <div className="dialog-menu-bar-container">
          <div className="dialog-exit-button" onClick={() => hitCloseCallback()}>
            <span>×</span>
          </div>
          <div className="dialog-menu-title">
            {(some(dialogTitle)) &&
              <div className="dialog-title-text">
                  {dialogTitle}
              </div>
            }
          </div>
        </div>
        <div className="dialog-body">
          {(some(msg)) ?
            <div className="dialog-message">
              {msg}
              {children}
            </div>
            :
            <>
              {children}
            </>
          }
        </div>
        <div className="dialog-bottom-right-icon"></div>
      </div>
    </Rnd>
  )
}

export default Dialog;

