import { launchWindowFunc } from "./actions";
import { setWindowMsg } from "./home";
import {LinkWindow} from "./link_list";
import {MediaElsewhere} from "../../data";


export function MediaAccountsWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return LinkWindow({
    setwMsg: setwMsg,
    links: MediaElsewhere,
    title: "media accounts",
    minWidth: 340,
  });
}
