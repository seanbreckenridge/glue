import React from "react";
import clsx from "clsx";
import { Rnd } from "react-rnd";
import { some } from "../../utils";

interface IDialogProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  isErr?: boolean;
  hitCloseCallback: () => void;
  title?: string;
  // have to provide one of these. If msg is not
  // provided, uses children
  // If both are provided, renders message in a div.dialog-message
  // div, then the children
  msg?: string;
  children?: any;
}

export const defaultDialogWidth = 200;
export const defaultDialogHeight = 100;

const Dialog = (props: IDialogProps) => {
  const dialogWidth = props.width ?? defaultDialogWidth;
  const dialogHeight = props.height ?? defaultDialogHeight;

  // false by default
  const errorDialog = props.isErr ?? false;

  const dialogTitle = props.title ?? (errorDialog ? "ERROR" : null);

  return (
    <Rnd
      default={{
        x: props.x,
        y: props.y,
        width: dialogWidth,
        height: dialogHeight,
      }}
      bounds="#desktop-body"
      minHeight={props.minHeight}
      minWidth={props.minWidth}
    >
      <div className={clsx("dialog", errorDialog && "error")}>
        <div className="dialog-menu-bar-container">
          <div
            className="dialog-exit-button"
            onClick={() => props.hitCloseCallback()}
          >
            <span>×</span>
          </div>
          <div className="dialog-menu-title">
            {some(dialogTitle) && (
              <div className="dialog-title-text"> {dialogTitle} </div>
            )}
          </div>
        </div>
        <div className="dialog-body">
          {
            // if the user provided a message, render it *and* the children
            // TODO: add scroll in react, right column should have up/down greyed out when content fits
            // may be required for scrolling on mobile
            // add buttons to the top right like https://i.imgur.com/bJCIDoO.png
            some(props.msg) ? (
              <div className="dialog-message">
                {props.msg}
                {props.children}
              </div>
            ) : (
              // else just render the children
              <> {props.children} </>
            )
          }
        </div>
        <div className="dialog-bottom-right-icon"></div>
      </div>
    </Rnd>
  );
};

export default Dialog;
