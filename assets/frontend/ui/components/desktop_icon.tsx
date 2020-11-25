import React, { memo, useState } from "react";
import { launchWindowFunc } from "../windows/actions";

// wrap some child element as an 'a' element
interface ILinkWrap {
  url: string;
  newTab?: boolean;
  children?: any;
}

const LinkWrap = memo(({ url, newTab, children }: ILinkWrap) => {
  const targetBlank = newTab ?? false;
  return (
    <a
      className="unlinkify"
      href={url}
      target={targetBlank ? "_blank" : undefined}
    >
      {children}
    </a>
  );
});

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
  // disable temporary after the user creates a window
  // in-case the user tried to double click
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleLaunchWindow = () => {
    if (!disabled) {
      props.click!();
      // props.mouseLeave() // unhighlight
      // disable this icon
      setDisabled(true);
      // and re-enable it in a bit
      setTimeout(() => {
        setDisabled(false);
      }, 800);
    }
  };

  const mouseEnter = () => {
    if (!disabled) {
      props.mouseEnter();
    }
  };

  const mouseLeave = () => {
    // should always just disable
    props.mouseLeave();
  };

  // quite repetitive, maybe this can be refactored?
  // if click is set, uses that function as the onClick
  // if its a link, wraps the image/text in a <a>
  //
  // this is so that control-click works on external links
  if (props.click !== undefined) {
    return (
      <figure
        className="desktop-icon"
        onClick={handleLaunchWindow}
        onTouchStart={mouseEnter}
        onTouchEnd={mouseLeave}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        <LinkWrap url="#">
          <img
            className="icon-img desktop-icon-interactable"
            src={props.iconurl}
            alt={props.caption}
          />
        </LinkWrap>
        <LinkWrap url="#">
          <figcaption className="pixel desktop-icon-interactable">
            <pre>
              <code>{props.caption}</code>
            </pre>
          </figcaption>
        </LinkWrap>
      </figure>
    );
  } else if (props.url !== undefined) {
    const isExternal = props.url!.startsWith("http");
    return (
      <figure
        className="desktop-icon"
        onTouchStart={mouseEnter}
        onTouchEnd={mouseLeave}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        <LinkWrap url={props.url!} newTab={true}>
          <img
            src={props.iconurl}
            alt={props.caption}
            className="icon-img desktop-icon-interactable"
          />
        </LinkWrap>
        <LinkWrap url={props.url!} newTab={true}>
          <figcaption className="pixel desktop-icon-interactable">
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
