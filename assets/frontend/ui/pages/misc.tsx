import { launchWindowFunc } from "./actions";
import { setWindowMsg } from "./home";
import {LinkWindow} from "./link_list";
import {MiscApps} from "../../data";


export function MiscWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return LinkWindow({
    setwMsg: setwMsg,
    links: MiscApps,
    title: "misc",
    minWidth: 250,
  });
}
