import React from "react";
import { Context, AppContextConsumer } from "../../app_provider";
import WrapApiError from "../components/wrap_api_error";
import { FeedData } from "./../../api_model";

export default function Feed() {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.feed}>
              <FeedPaginator data={value.feed as FeedData} />
            </WrapApiError>
          );
        }}
      </AppContextConsumer>
    </>
  );
}

interface IFeedPaginator {
  data: FeedData;
}

const FeedPaginator = ({ data }: IFeedPaginator) => {
  return <div>{JSON.stringify(data)}</div>;
};
