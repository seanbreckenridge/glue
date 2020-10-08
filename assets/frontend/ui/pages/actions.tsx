import { FeedWindow } from "./feed";
import { CubingWindow } from "./cubing";
import { ElseWhereWindow } from "./elsewhere";
import { LinkInfo } from "../../data";
import { setWindowMsg } from "./home";

// interface to define what happens when the user clicks on things

// custom pages implemeneted in react
interface IHashActionFunc {
  // weird that page is needed here
  [page: string]: Function;
}

// dont do 100% because of the margin on the home page
// 75% is of window height/width, not surrounding countainer
export const fullScreenDialogScale = 0.75;

// create a closure around the state. could probably also
// be done with useContext, but this works
//
// returns a function which receieves the message interface
// as an argument,  which returns the function that launches this onClick
// action (open the dialog, does something on the page)
export const actions: IHashActionFunc = {
  "Media Feed": FeedWindow,
  Cubing: CubingWindow,
  "Me Elsewhere": ElseWhereWindow,
};

// returns what this icon does when its clicked
export function getAction(el: LinkInfo, setwMsg: setWindowMsg): Function {
  const action: Function = actions[el.name];
  if (action !== undefined) {
    // create the closure so that actions have
    // access to the set window message functions
    return action(setwMsg);
  } else if (el.url !== undefined && el.url !== "") {
    return () => {
      // (reloads the page, to an external URL)
      window.location.href = el.url!;
    };
  }
  throw Error("Could not find an appropriate action for " + JSON.stringify(el));
}
