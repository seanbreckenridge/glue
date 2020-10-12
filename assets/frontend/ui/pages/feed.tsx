import React from "react";
import { Context, AppContextConsumer } from "../../app_provider";
import WrapApiError from "../components/wrap_api_error";
import { FeedData, FeedItem } from "./../../api_model";
import { setWindowMsg } from "./home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import TapLink from "../components/taplink";
import { fullScreenDialogScale, launchWindowFunc } from "./actions";

const minWidth = 380;
const minHeight = 200;

export function FeedWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const feedDialogWidth = browserWidth * fullScreenDialogScale;
    const feedDialogHeight = browserHeight * fullScreenDialogScale;
    const windowId = Date.now().toString();
    const feedDialog = (
      <>
        <Dialog
          x={x - feedDialogWidth / 2}
          y={y - feedDialogHeight / 2}
          width={feedDialogWidth}
          height={feedDialogHeight}
          title="media feed"
          windowId={windowId}
          minWidth={minWidth}
          minHeight={minHeight}
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <Feed />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: feedDialog,
    });
  };
}

function Feed() {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.feed}>
              <FeedData data={value.feed! as FeedData} />
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

const FeedData = ({ data }: IFeedPaginator) => {
  return (
    <div className="feed-body">
      {data.map((item: FeedItem, index: number) => {
        return (
          <TapLink href={item.site_url} className="unlinkify" key={index}>
            <div className="feed-item-row">
              <div className="feed-item-image">
                <img src={item.image_url} alt="" />
              </div>
              <div className="feed-item-description">
                <p>{item.title}</p>
                <p>{item.timestamp}</p>
              </div>
            </div>
          </TapLink>
        );
      })}
    </div>
  );
};
