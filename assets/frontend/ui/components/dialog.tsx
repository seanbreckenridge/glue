import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Rnd } from "react-rnd";
import { some } from "../../utils";
import Repeatable from "react-repeatable";

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

interface windowData {
  height: number;
  width: number;
  // size of the entire scrollable element
  fullY: number;
}

const Dialog = (props: IDialogProps) => {
  // dialog related
  const dialogWidth = props.width ?? defaultDialogWidth;
  const dialogHeight = props.height ?? defaultDialogHeight;
  const errorDialog = props.isErr ?? false;
  const dialogTitle = props.title ?? (errorDialog ? "ERROR" : null);
  const hasMsg = some(props.msg);

  const defaultWindowData: windowData = {
    width: dialogWidth,
    height: dialogHeight,
    fullY: 0,
  };

  // scroll related
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [winData, setWinData] = useState(defaultWindowData);
  const scrollRef = useRef<HTMLDivElement>(null);

  // disable dragging/resizing while mousing over butons
  const [dragDisable, setDragDisable] = useState<boolean>(false);
  const [resizable, setResizable] = useState<boolean>(true);

  const scrollTo = (height: number) => {
    const el: HTMLDivElement | null = scrollRef.current;
    if (el === null) {
      return;
    }
    el.scrollTo({ top: height });
    setScrollOffset(height);
  };

  const handleScrollUp = () => {
    scrollTo(Math.max(0, scrollOffset - winData.height / 3));
  };

  const handleScrollDown = () => {
    scrollTo(
      Math.min(
        winData.fullY - winData.height,
        scrollOffset + winData.height / 3
      )
    );
  };

  const handleEnableRND = () => {
    // incase the x button was clicked, make sure element still exists
    if (scrollRef) {
      setDragDisable(false);
      setResizable(true);
    }
  };

  const handleDisableRND = () => {
    if (scrollRef) {
      setDragDisable(true);
      setResizable(false);
    }
  };

  const saveElementData = () => {
    const el: HTMLDivElement | null = scrollRef.current;
    if (el === null) {
      return;
    }
    const elData: ClientRect = scrollRef.current!.getBoundingClientRect();
    setWinData({
      height: elData.height,
      width: elData.width,
      fullY: el.scrollHeight,
    });
  };

  useEffect(() => {
    // onload, save element attributes
    saveElementData();
    scrollTo(0); // start at 0, to fix leftover client data from reloads
  }, []);

  return (
    <Rnd
      default={{
        x: props.x,
        y: props.y,
        width: dialogWidth,
        height: dialogHeight,
      }}
      bounds="#desktop-body"
      onResizeStop={saveElementData}
      onDragStop={saveElementData}
      minHeight={props.minHeight}
      minWidth={props.minWidth}
      disableDragging={dragDisable}
      enableResizing={resizable}
    >
      <div className={clsx("dialog", errorDialog && "error")}>
        <div className="dialog-menu-bar-container">
          <div
            className="dialog-menu-button dialog-exit-button"
            onClick={props.hitCloseCallback}
            onTouchEnd={props.hitCloseCallback} // also close on touch events
            onMouseEnter={handleDisableRND}
            onMouseLeave={handleEnableRND}
          >
            <span>×</span>
          </div>
          <div className="dialog-menu-title">
            {some(dialogTitle) && (
              <div className="dialog-title-text"> {dialogTitle} </div>
            )}
          </div>
          <div
            className="dialog-menu-button dialog-up-button"
            onTouchStart={handleDisableRND} // disable dragging when user starts touching
            onTouchEnd={() => {
              handleEnableRND();
              handleScrollUp(); // scroll on touch end, else you have to do weird double clicks
            }}
            onMouseEnter={handleDisableRND}
            onMouseLeave={handleEnableRND}
            onClick={handleScrollUp}
          >
            <Repeatable
              tag="button"
              type="button"
              repeatInterval={100}
              repeatCount={9999}
              onHold={handleScrollUp}
            >
              ▲
            </Repeatable>
          </div>
          <div
            className="dialog-menu-button dialog-down-button"
            onTouchStart={handleDisableRND}
            onTouchEnd={() => {
              handleEnableRND();
              handleScrollDown();
            }}
            onMouseEnter={handleDisableRND}
            onMouseLeave={handleEnableRND}
            onClick={handleScrollDown}
          >
            <Repeatable
              tag="button"
              type="button"
              repeatInterval={100}
              repeatCount={9999}
              onHold={handleScrollDown}
            >
              ▼
            </Repeatable>
          </div>
        </div>
        <div
          ref={scrollRef}
          className={clsx("dialog-body", hasMsg && "dialog-message")}
          onWheel={(e) => {
            e.preventDefault();
            let targetScrollHeight: number = scrollOffset + e.deltaY * 15;

            // make sure this is within bounds, else default
            if (targetScrollHeight < 0) {
              targetScrollHeight = 0;
            } else {
              const maxScrollHeight = winData.fullY - winData.height;
              if (targetScrollHeight > maxScrollHeight) {
                targetScrollHeight = maxScrollHeight;
              }
            }
            scrollTo(targetScrollHeight);
          }}
        >
          {
            // if the user provided a message, render it *and* the children
            hasMsg ? (
              <>
                {props.msg}
                {props.children}
              </>
            ) : (
              // else just render the children
              <> {props.children} </>
            )
          }
        </div>
        {/* TODO: add scrollbar on the right offset, use scrollOffset, winData.x and winData.fullY to create the rect */}
        <div className="dialog-bottom-right-icon"></div>
      </div>
    </Rnd>
  );
};

export default Dialog;
