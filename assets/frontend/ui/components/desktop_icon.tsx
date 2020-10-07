import React from "react";
import {PersonalData} from "../../api_model";

// dont attach the link here, handle the onClick at the higher level
// this just handles drawing the icon
interface IDesktopIcon {
  caption: string;
  iconurl: string;
}

// TODO: accept a function which does what this does when its clicked
// on hover, invert
// on click, run callback
// adding a dotted border to figcaption, and inverting colors

// darken onHover
// flip contrast on click
const DesktopIcon = ({caption, iconurl}: IDesktopIcon) => {
  return (
    <>
      <figure className="desktop-icon">
        <img className="desktop-icon-interactable" src={iconurl} alt={caption} />
        <figcaption>
          <pre>
            <code className="desktop-icon-interactable">
              {caption}
            </code>
          </pre>
        </figcaption>
      </figure>
    </>
  )
}

interface IHomeIcons {
  data: PersonalData;
}

export default function HomeIcons(props: IHomeIcons) {
  return (
    <div className="home-icons-container">
      {props.data.here.map((el) =>
        <div key={el.name} className="home-icon">
          <DesktopIcon caption={el.name} iconurl={el.image ?? 'https://sean.fish/favicon.ico'} />
        </div>
      )}
      < br />
      {props.data.elsewhere.map((el) =>
        <div key={el.name} className="home-icon">
          <DesktopIcon caption={el.name} iconurl={el.image ?? 'https://sean.fish/favicon.ico'} />
        </div>
      )}
    </div>
  )
}
