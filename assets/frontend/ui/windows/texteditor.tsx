import React, { useState, useRef } from "react";
import { paragraph } from "txtgen";

import { setWindowMsg } from "./../home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { fullScreenDialogScale, launchWindowFunc } from "./actions";

const minHeight = 400;
const minWidth = 300;

export function TextEditorWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const dialogWidth = browserWidth * fullScreenDialogScale;
    const dialogHeight = browserHeight * fullScreenDialogScale;
    const windowId = Date.now().toString();
    const dialogObj = (
      <>
        <Dialog
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="textedit"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          disableBodyDragging={true}
          // when close is hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <TextEditor />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: dialogObj,
    });
  };
}

// https://stackoverflow.com/a/30832210/9348376
function downloadTextFile(data: string, filename: string) {
  let file: Blob = new Blob([data], { type: "text/plain" });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    let a: HTMLAnchorElement = document.createElement("a");
    let url: string = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

const defaultFilename = "Untitled.txt";

const TextEditor = () => {
  const [textAreaContents, setTextAreaContents] = useState<string>("");
  const [filename, setFilename] = useState<string>(defaultFilename);
  const filenameTextField = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    downloadTextFile(textAreaContents, filename);
  };

  const randomizeText = () => {
    setTextAreaContents(paragraph());
  };

  return (
    <div className="textedit-body">
      <div className="textedit-controls">
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            ref={filenameTextField}
            onTouchEnd={() => {
              filenameTextField.current!.focus();
            }} // for mobile
            type="text"
            name="filename"
            className="controls-input"
            placeholder={defaultFilename}
            value={filename}
            onChange={(e: any) => {
              setFilename(e.target.value);
            }}
          />
          <a
            href="#"
            className="input-go pixel unlinkify"
            onTouchEnd={handleSave}
            onClick={handleSave}
          >
            SAVE
          </a>
          <a
            href="#"
            className="input-go pixel unlinkify"
            onTouchEnd={randomizeText}
            onClick={randomizeText}
          >
            RANDOMIZE
          </a>
          {/* so that ctrl enter works */}
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
      <textarea
        placeholder="Enter text here..."
        name="textedit"
        autoFocus
        value={textAreaContents}
        onChange={(e: any) => {
          setTextAreaContents(e.target.value);
        }}
      />
    </div>
  );
};
