import { useState, useEffect } from "react";

// https://stackoverflow.com/a/36862446/9348376

interface Dimensions {
  browserWidth: number;
  browserHeight: number;
}

interface Point {
  x: number;
  y: number;
}

// get center x, y location, randomized
// by 10% in some direction
export function jitterCenterLocation(): Point {
  const { x, y } = centerLocation();
  const jitterDist = y / 10;
  return {
    x: x + jitterDist * Math.random() - jitterDist / 2,
    y: y + jitterDist * Math.random() - jitterDist / 2,
  };
}

// get center x, y location
export function centerLocation(): Point {
  const { browserWidth, browserHeight } = getWindowDimensions();
  return {
    x: browserWidth / 2,
    y: browserHeight / 2,
  };
}

export function getWindowDimensions(): Dimensions {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    browserWidth: width,
    browserHeight: height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
