import React from "react";
import {PersonalData} from "../../api_model";
import {setIconFunc} from "../gui";
import clsx from "clsx";

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

interface IHomeIcons {
  data: PersonalData;
  selectedIcon: string;
  setSelectedIcon: setIconFunc;
}

function HomeIcons(props: IHomeIcons) {
  console.log(props.selectedIcon);
  return (
    <div className="home-icons-container">
      {props.data.map((el) =>
        <div key={el.name} className={clsx("home-icon", props.selectedIcon == el.name && "selected")}>
          <DesktopIcon
            click={() => console.log("clicked " + el.name)}
            mouseEnter={() => props.setSelectedIcon(el.name)}
            mouseLeave={() => props.setSelectedIcon('')} // set to empty string, which means nothing is highlighted
            caption={el.name}
            iconurl={el.icon ?? 'https://sean.fish/favicon.ico'} />
        </div>
      )}
    </div>
  )
}

export {
  HomeIcons,
  DesktopIcon,
};
