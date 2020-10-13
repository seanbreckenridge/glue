import React, { useState } from "react";
import DesktopErrorDialog from "./desktop_error_dialog";
import WhatDoNow from "../windows/what_do_now";
import { some, errored } from "../../utils";

interface IWrapError<T> {
  data?: Result<T>;
  loadingText?: string;
  errorMsgText?: string;
  children: any;
}

export default function WrapApiError<T>(props: IWrapError<T>) {
  // If there was an API error displaying info,
  // whether or not the user clicked the 'x' button
  const [userClosedError, setUserClosedError] = useState(false);

  const loading = props.loadingText ?? "Loading...";
  const errorMsg = props.errorMsgText ?? "Error fetching data...";

  return (
    <div className="wrap-error">
      {!some(props.data) ? (
        <h3>{loading}</h3>
      ) : errored(props.data) ? (
        // if there was an API error
        !userClosedError ? (
          // If the user hasn't hit the 'x' button in the dialog
          <DesktopErrorDialog
            msg={errorMsg}
            err={props.data as Error}
            closeDialog={() => setUserClosedError(true)}
          />
        ) : (
          <WhatDoNow err={props.data as Error} />
        )
      ) : (
        <>{props.children}</>
      )}
    </div>
  );
}
