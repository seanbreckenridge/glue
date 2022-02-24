import { launchWindowFunc } from "./actions";
import { setWindowMsg } from "./../home";
import { LinkWindow } from "./link_list";
import { MiscLinks } from "../../data";

const minWidth = 250;

export function MiscWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return LinkWindow({
    setwMsg: setwMsg,
    links: MiscLinks,
    title: "misc",
    minWidth: minWidth,
  });
}
