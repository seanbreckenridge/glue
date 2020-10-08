import React from "react";
import { Context, AppContextConsumer } from "../../app_provider";
import WrapApiError from "../components/wrap_api_error";
// import {CubingData} from "./../../api_model";


export default function Cubing() {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.cubing}>
              <div>{JSON.stringify(value.cubing)}</div>
            </WrapApiError>
          );
        }}
      </AppContextConsumer>
    </>
  );
}

