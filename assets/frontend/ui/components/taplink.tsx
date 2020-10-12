import React, {
  DetailedHTMLProps,
  AnchorHTMLAttributes,
  PropsWithChildren,
} from "react";

// a tappable link to work in draggable components

const TapLink = (
  props: PropsWithChildren<
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >
  >
) => {
  return (
    <a
      {...props}
      onTouchEnd={() => {
        if (props.href !== undefined) {
          window.location.href = props.href!;
        }
      }}
    >
      {props.children}
    </a>
  );
};

export default TapLink;
