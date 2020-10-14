// this isnt used for any page, its the file I copy/paste when starting a new window
import React, { useRef, useState, ChangeEvent } from "react";
import { setWindowMsg } from "./../home";
import { GuestBookComments, GuestBookComment } from "../../api_model";
import WrapApiError from "../components/wrap_api_error";
import {
  jitterCenterLocation,
  getWindowDimensions,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { launchWindowFunc, fullScreenDialogScale } from "./actions";
import { Context, AppContextConsumer } from "../../app_provider";

const minHeight = 400;
const minWidth = 300;

// assumes values are valid here
function handleRequest(name: string, comment: string): void {
  // send request
  console.log(name);
  console.log(comment);
  // open dialog notifying the user of approval process
}

export function GuestBookWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y } = jitterCenterLocation();
    const { browserWidth, browserHeight } = getWindowDimensions();
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
          title="guest book"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          disableBodyDragging={true}
          // when close is hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <div className="guestbook-body">
            <AppContextConsumer>
              {(value: Context) => {
                return (
                  <WrapApiError data={value.comments}>
                    <GuestBook data={value.comments! as GuestBookComments} />
                  </WrapApiError>
                );
              }}
            </AppContextConsumer>
          </div>
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

interface IGuestBook {
  data: GuestBookComments;
}

const GuestBook = ({ data }: IGuestBook) => {
  return (
    <>
      <GuestBookForm />
      <div className="guestbook-comments">
        {data.data.map((cmnt: GuestBookComment) => {
          return (
            <div key={cmnt.id} className="comment-row">
              <div className="comment-name">{cmnt.name}</div>
              <div className="comment-text">{cmnt.comment}</div>
              <hr />
            </div>
          );
        })}
      </div>
    </>
  );
};

const GuestBookForm = () => {
  const [name, setName] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");

  const nameField = useRef<HTMLInputElement>(null);
  const commentField = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const nameVal = name.toString();
    const commentVal = comment.toString();
    if (validateName() && validateComment()) {
      setName("");
      setComment("");
      handleRequest(nameVal, commentVal);
    }
  };

  const focusName = () => {
    nameField.current!.focus();
  };

  const focusCommentField = () => {
    commentField.current!.focus();
  };

  // if the name isnt provided, looks it up in state
  function validateName(fieldValue?: string): boolean {
    let errMsg: string = "";
    let nameVal = fieldValue ?? name;
    if (nameVal.length < 1) {
      errMsg = "You didn't enter a name...";
    }
    setError(errMsg);
    return errMsg === "";
  }

  function validateComment(fieldValue?: string): boolean {
    let errMsg = "";
    let commentVal = fieldValue ?? comment;
    if (commentVal.length >= 250) {
      errMsg = "Comment should be less than 250 characters!";
    } else if (commentVal.length < 1) {
      errMsg = "Comment should be at least a character long...";
    }
    setError(errMsg);
    return errMsg === "";
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    let fieldVal: string = e.target.value;
    setName(fieldVal);
    validateName(fieldVal);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let fieldVal: string = e.target.value;
    setComment(fieldVal); // set this regardless of whether or not theres an error
    validateComment(fieldVal);
  };

  return (
    <>
      <form
        className="guestbook-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="guestbook-form-row">
          <label onClick={focusName} onTouchEnd={focusName}>
            Name:{" "}
          </label>

          <input
            ref={nameField}
            onTouchEnd={focusName}
            type="text"
            name="person-name"
            placeholder="your name..."
            className="controls-input"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="guestbook-form-row guestbook-textarea-row">
          <label onClick={focusCommentField} onTouchEnd={focusCommentField}>
            Comment:{" "}
          </label>
          <textarea
            ref={commentField}
            onTouchEnd={focusCommentField}
            placeholder="write whatever you want here!"
            name="person-comment"
            className="guestbook-textarea"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>
        <a
          href="#"
          className="input-go pixel unlinkify guestbook-form-row"
          onTouchEnd={handleSubmit}
          onClick={handleSubmit}
        >
          COMMENT
        </a>
        {/* so that ctrl enter works */}
        <input type="submit" style={{ display: "none" }} />
        <span className="guestbook-error">{error}</span>
      </form>
    </>
  );
};
