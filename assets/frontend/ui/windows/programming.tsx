import { launchWindowFunc } from "./actions";
import { setWindowMsg } from "./../home";
import { LinkWindow } from "./link_list";
import { Programming } from "../../data";

export function ProgrammingWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return LinkWindow({
    setwMsg: setwMsg,
    links: Programming,
    title: "programming",
    minWidth: 320,
  });
}
