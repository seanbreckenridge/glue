import React from "react";
import { some } from "../../utils";
import { launchWindowFunc } from "../pages/actions";

// wrap some child element as an 'a' element
interface ILinkWrap {
  url: string;
  children?: any;
}

const LinkWrap = ({ url, children }: ILinkWrap) => {
  return (
    <a className="unlinkify" href={url}>
      {children}
    </a>
  );
};

// dont attach the link here, handle the onClick at the higher level
// this just handles drawing the icon
interface IDesktopIcon {
  caption: string;
  iconurl: string;
  mouseEnter: () => void;
  mouseLeave: () => void;
  // must specify either an click or a link
  click?: launchWindowFunc;
  url?: string;
}

// on hover, invert
// on click, run callback
const DesktopIcon = (props: IDesktopIcon) => {
  // quite repetitive, maybe this can be refactored?
  // if click is set, uses that function as the onClick
  // if its a link, wraps the image/text in a <a>
  //
  // this is so that control-click works on external links
  if (some(props.click)) {
    return (
      <figure
        className="desktop-icon"
        onClick={() => props.click!()}
        onMouseEnter={() => props.mouseEnter()}
        onMouseLeave={() => props.mouseLeave()}
      >
        <img
          className="desktop-icon-interactable"
          src={props.iconurl}
          alt={props.caption}
        />
        <figcaption className="desktop-icon-interactable">
          <pre>
            <code>{props.caption}</code>
          </pre>
        </figcaption>
      </figure>
    );
  } else if (some(props.url)) {
    return (
      <figure
        className="desktop-icon"
        onMouseEnter={() => props.mouseEnter()}
        onMouseLeave={() => props.mouseLeave()}
      >
        <LinkWrap url={props.url!}>
          <img
            className="desktop-icon-interactable"
            src={props.iconurl}
            alt={props.caption}
          />
        </LinkWrap>
        <LinkWrap url={props.url!}>
          <figcaption className="desktop-icon-interactable">
            <pre>
              <code>{props.caption}</code>
            </pre>
          </figcaption>
        </LinkWrap>
      </figure>
    );
  } else {
    throw Error(
      "DesktopIcon expects either the 'click' or 'url' prop to be set)"
    );
  }
};

export default DesktopIcon;
