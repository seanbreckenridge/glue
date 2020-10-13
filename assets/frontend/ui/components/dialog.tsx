import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Repeatable from "react-repeatable";
import { Rnd } from "react-rnd";

import {
  AppContextConsumer,
  setSelectedWindow,
  Context,
} from "../../app_provider";

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
  windowId?: string;
  // dont allow user to drag while hovering body
  disableBodyDragging?: boolean;
  // have to provide one of these. If msg is not
  // provided, uses children
  // If both are provided, renders message in a div.dialog-message
  // div, then the children
  msg?: string;
  children?: any;
}

export const defaultDialogWidth = 200;
export const defaultDialogHeight = 100;

// set the current window we are using as the 'top' window in global AppContext
function setSelfSelected(ctx: Context, windowId?: string) {
  setSelectedWindow(ctx.setContext, windowId);
}

interface windowData {
  height: number;
  width: number;
  // size of the entire scrollable element
  fullY: number;
}

// hides parts of the dialog while they're animating/opening
interface windowParts {
  showBackground: boolean;
  showMenuBar: boolean;
  showBody: boolean;
  showExitButton: boolean;
  showScrollButtons: boolean;
}

const windowPartsDefault = {
  showBackground: false,
  showMenuBar: false,
  showBody: false,
  showExitButton: false,
  showScrollButtons: false,
};

const Dialog = (props: IDialogProps) => {
  // dialog related
  const dialogWidth = props.width ?? defaultDialogWidth;
  const dialogHeight = props.height ?? defaultDialogHeight;
  const errorDialog = props.isErr ?? false;
  const dialogTitle: string | null =
    props.title ?? (errorDialog ? "ERROR" : null);
  const hasMsg = props.msg !== undefined;
  const disableBodyDragging = props.disableBodyDragging ?? false;

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

  // animate windows
  const [winShow, setWinShow] = useState<windowParts>(windowPartsDefault);

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

  // do some setTimeOuts to load the menu bar/dialog body
  const showWindowParts = () => {
    setTimeout(() => {
      setWinShow((old: windowParts) => {
        return {
          ...old,
          showBackground: true,
        };
      });
      setTimeout(() => {
        setWinShow((old: windowParts) => {
          return {
            ...old,
            showMenuBar: true,
          };
        });
        setTimeout(() => {
          setWinShow((old: windowParts) => {
            return {
              ...old,
              showBody: true,
            };
          });
          setWinShow((old: windowParts) => {
            return {
              ...old,
              showExitButton: true,
            };
          });
          setWinShow((old: windowParts) => {
            return {
              ...old,
              showScrollButtons: true,
            };
          });
        }, 200);
      }, 200);
    }, 100);
  };

  useEffect(() => {
    // onload, save element attributes
    saveElementData();
    showWindowParts();
    // if this is only meant to be dragged by the title, disable dragging here
    // the arrow functions in the body check if this is disabled before firing the handleEnableRND
    if (disableBodyDragging) {
      setDragDisable(false);
    }
    scrollTo(0); // start at 0, to fix leftover client data from reloads
  }, []);

  return (
    <AppContextConsumer>
      {(value: Context) => {
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
            // onClick/Drag/Touch, increase z-index of this window
            onClick={() => setSelfSelected(value, props.windowId)}
            onDragStart={() => setSelfSelected(value, props.windowId)}
            onResizeStart={() => setSelfSelected(value, props.windowId)}
            onTouchStart={() => setSelfSelected(value, props.windowId)}
            onMouseDown={(event: MouseEvent) => {
              // when user clicks, drags or resizes a window
              // dont draw rectangles on the desktop
              event.stopPropagation();
            }}
            className={clsx(
              "rnd",
              value.selectedWindow === props.windowId && "top-dialog"
            )}
            // these are unset if another window sets itself as the selected window
          >
            <div className={clsx("dialog", errorDialog && "error")}>
              <div
                className={clsx(
                  "dialog-loading-container",
                  winShow.showBackground || "dialog-part-hidden"
                )}
              >
                <div
                  className={clsx(
                    "dialog-menu-bar-container",
                    winShow.showMenuBar || "dialog-part-hidden"
                  )}
                >
                  <div
                    className={clsx(
                      "dialog-menu-button dialog-exit-button",
                      winShow.showExitButton || "dialog-part-hidden"
                    )}
                    onClick={props.hitCloseCallback}
                    onTouchEnd={props.hitCloseCallback} // also close on touch events
                    onMouseEnter={handleDisableRND}
                    onMouseLeave={handleEnableRND}
                  >
                    <span>×</span>
                  </div>
                  <div className="dialog-menu-title">
                    {dialogTitle && (
                      <div className="dialog-title-text pixel">
                        {" "}
                        {dialogTitle}{" "}
                      </div>
                    )}
                  </div>
                  <div
                    className={clsx(
                      "dialog-menu-button dialog-up-button",
                      winShow.showScrollButtons || "dialog-part-hidden"
                    )}
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
                    className={clsx(
                      "dialog-menu-button dialog-down-button",
                      winShow.showScrollButtons || "dialog-part-hidden"
                    )}
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
                  className={clsx(
                    "dialog-body",
                    hasMsg && "dialog-message",
                    winShow.showBody || "dialog-part-hidden"
                  )}
                  onWheel={(e) => {
                    e.preventDefault();
                    let targetScrollHeight: number =
                      scrollOffset + e.deltaY * 15;

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
                  // for elements that want it, disable/enable
                  // dragging on the body when hovered
                  onMouseEnter={() => {
                    setDragDisable(disableBodyDragging);
                  }}
                  onClick={() => {
                    setDragDisable(disableBodyDragging);
                  }}
                  onMouseLeave={handleEnableRND}
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
                  {/* a dummy element that recives the context, with a useEffect hook
                    that selects this when its launched */}
                  <AutoFocusDialog ctx={value} windowId={props.windowId} />
                </div>
                {/* TODO: add scrollbar on the right offset, use scrollOffset, winData.x and winData.fullY to create the rect */}
                <div className="dialog-bottom-right-icon"></div>
              </div>
            </div>
          </Rnd>
        );
      }}
    </AppContextConsumer>
  );
};

interface IAutoFocusDialog {
  ctx: Context;
  windowId?: string;
}

const AutoFocusDialog = ({ ctx, windowId }: IAutoFocusDialog) => {
  useEffect(() => {
    setSelfSelected(ctx, windowId);
  }, []);
  return <></>;
};

export default Dialog;
