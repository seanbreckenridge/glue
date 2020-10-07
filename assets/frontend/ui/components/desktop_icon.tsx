import React from "react";

// dont attach the link here, handle the onClick at the higher level
// this just handles drawing the icon
interface IDesktopIcon {
  caption: string;
  iconurl: string;
}

// darken onHover
// flip contrast on click
const DesktopIcon = ({caption, iconurl}: IDesktopIcon) => {
  return (
    <>
      <figure>
        <img src={iconurl} alt={caption} />
        <figcaption>
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
