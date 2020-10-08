import React from "react";

// dont attach the link here, handle the onClick at the higher level
// this just handles drawing the icon
interface IDesktopIcon {
  caption: string;
  iconurl: string;
  mouseEnter: Function;
  mouseLeave: Function;
  click: Function;
}

// on hover, invert
// on click, run callback
const DesktopIcon = (props: IDesktopIcon) => {
  return (
    <>
      <figure className="desktop-icon">
        <img
          className="desktop-icon-interactable"
          src={props.iconurl}
          alt={props.caption}
          onClick={() => props.click()}
          onMouseEnter={() => props.mouseEnter()}
          onMouseLeave={() => props.mouseLeave()}
        />
        <figcaption
          className="desktop-icon-interactable"
          onClick={() => props.click()}
          onMouseEnter={() => props.mouseEnter()}
          onMouseLeave={() => props.mouseLeave()}
        >
          <pre>
            <code>{props.caption}</code>
          </pre>
        </figcaption>
      </figure>
    </>
  );
};

export default DesktopIcon;
