import React from "react";

interface IWhatDoNow {
  err: Error;
}

export default function WhatToDoNow({ err }: IWhatDoNow) {
  return (
    <>
      <div id="what-do-now">
        <p>Hmmmmmmm......</p>
        <p>
          I don't think you should be seeing this, but if you'd like to help me,
          you can report this{" "}
          <a href="https://en.wikipedia.org/wiki/Wikipedia:Reporting_JavaScript_errors">
            with the console logs
          </a>{" "}
          over{" "}
          <a href="https://github.com/seanbreckenridge/glue/issues/new">here</a>
        </p>
        <p>{err.message}</p>
      </div>
    </>
  );
}
