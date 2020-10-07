import React from "react";
import Dialog from "./dialog"
import {some} from "../../utils";

interface IDesktopErrorDialogProps {
  height?: number;
  width?: number;
  msg: string;
  err?: Error; // if provided, renders the error message text as another node
  closeDialog: Function;
}

const DesktopErrorDialog = ({msg, err, height, width, closeDialog}: IDesktopErrorDialogProps) => {
  const dialogHeight = height ?? 140;
  const dialogWidth = width ?? 250;

  return (
    <Dialog msg={msg} isErr={true} height={dialogHeight} width={dialogWidth} hitCloseCallback={closeDialog}>
      {/* there was an error!, include the stacktrace as children, in addition to the message*/}
      {some(err)
        ? <div className="dialog-error-stacktrace"> {err!.message} </div>
        : <></ > // empty children if no error. seems to be required
      }
    </Dialog>
  )
}

export default DesktopErrorDialog;
