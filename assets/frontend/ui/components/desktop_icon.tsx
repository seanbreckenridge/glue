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

// TODO: accept a function which does what this does when its clicked
// on hover, invert
// on click, run callback
// adding a dotted border to figcaption, and inverting colors

const DesktopIcon = ({caption, iconurl, click, mouseEnter, mouseLeave}: IDesktopIcon) => {
  return (
    <>
      <figure className="desktop-icon">
        <img className="desktop-icon-interactable"
          src={iconurl}
          alt={caption}
          onClick={() => click()}
          onMouseEnter={() => mouseEnter()}
          onMouseLeave={() => mouseLeave()}
        />
        <figcaption className="desktop-icon-interactable"
          onClick={() => click()}
          onMouseEnter={() => mouseEnter()}
          onMouseLeave={() => mouseLeave()}>
          <pre>
            <code>
              {caption}
            </code>
          </pre>
        </figcaption>
      </figure>
    </>
  )
}

export default DesktopIcon;
