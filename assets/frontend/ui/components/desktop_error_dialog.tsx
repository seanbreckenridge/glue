import React from "react";
import Dialog from "./dialog"
import {some} from "../../utils";

interface IDesktopErrorDialogProps {
  height?: number;
  width?: number;
  msg: string;
  err?: Error; // if provided, renders the error message text as another node
}

const DesktopErrorDialog = ({msg, err, height, width}: IDesktopErrorDialogProps) => {
  const dialogHeight = height ?? 140;
  const dialogWidth = width ?? 250;

  return (
    <Dialog msg={msg} isErr={true} height={dialogHeight} width={dialogWidth} hitCloseCallback={() => {}}>
      {some(err) ?
      <div className="dialog-error-stacktrace">
        {err!.message}
      </div>
      :
      <>
      </>
      }
    </Dialog>
  )
}

export default DesktopErrorDialog;
