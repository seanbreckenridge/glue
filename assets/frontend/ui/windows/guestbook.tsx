// this isnt used for any page, its the file I copy/paste when starting a new window
import React, {
  useRef,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import axios, { AxiosResponse } from "axios";

import { setWindowMsg } from "./../home";
import { GuestBookComments, GuestBookComment } from "../../api_model";
import WrapApiError from "../components/wrap_api_error";
import {
  jitterCenterLocation,
  getWindowDimensions,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { launchWindowFunc } from "./actions";
import { Context, AppContextConsumer } from "../../app_provider";
import { ok } from "../../utils";

const minHeight = 300;
const minWidth = 300;
const dialogScale = 0.6;

// assumes values are valid here
async function handleRequest(
  name: string,
  comment: string,
  setResponse: Dispatch<SetStateAction<string>>
): Promise<void> {
  const res: AxiosResponse | Error = await axios
    .post("/api/gb_comment/", { name: name, comment: comment })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((e: Error) => {
      return e;
    });
  if (setResponse) {
    if (ok(res)) {
      setResponse(
        "Thanks! Your comment should appear here in a few hours, I review these before they go live."
      );
    } else {
      setResponse(
        "There was an error adding your comment... If this doesn't fix itself, you can email me at 'ssbreckenridge@me.com'"
      );
    }
  }
}

export function GuestBookWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y } = jitterCenterLocation();
    const { browserWidth, browserHeight } = getWindowDimensions();
    const dialogWidth = browserWidth * dialogScale;
    const dialogHeight = browserHeight * dialogScale;
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
                    <GuestBook
                      comments={value.comments! as GuestBookComments}
                    />
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
  comments: GuestBookComments;
}

const GuestBook = ({ comments }: IGuestBook) => {
  return (
    <>
      <GuestBookForm />
      <div className="guestbook-comments">
        {comments.map((cmnt: GuestBookComment) => {
          return (
            <div key={cmnt.id} className="comment-row">
              <div className="comment-name">{cmnt.name}</div>
              <div className="comment-text">{cmnt.comment}</div>
              <div className="comment-date">{cmnt.at}</div>
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
  const [status, setStatus] = useState<string>("");

  const nameField = useRef<HTMLInputElement>(null);
  const commentField = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const nameVal = name.toString();
    const commentVal = comment.toString();
    if (validateName() && validateComment()) {
      setName("");
      setComment("");
      handleRequest(nameVal, commentVal, setStatus);
    }
  };

  const focusName = () => {
    if (nameField !== null) {
      nameField.current!.focus();
    }
  };

  const focusCommentField = () => {
    if (commentField !== null) {
      commentField.current!.focus();
    }
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
        <span className="guestbook-response">{status}</span>
      </form>
    </>
  );
};
