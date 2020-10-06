import React from "react";
import {UIDataConsumer} from "./loading";
import {some, ok} from "./utils";

const PersonalData: React.FC<{}> = () => {
  return (
    // requires function which receives value from provider
    <UIDataConsumer>
      {data =>
        (some(data) ?
          <div>
            {JSON.stringify(data!)}
          </div>
          :
          <>
            <p>Loading data...</p>
          </>
        )}
    </UIDataConsumer>)
}

export default PersonalData;
