import { useState, useEffect } from 'react';

// https://stackoverflow.com/a/36862446/9348376

interface Dimensions {
  browserWidth: number;
  browserHeight: number;
}

function getWindowDimensions(): Dimensions {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    browserWidth : width,
    browserHeight: height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

