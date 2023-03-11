import { useEffect, useState } from "react";

export const MOBILE_CUTOFF = 1024;

export default function useIsMobile() {
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (window) {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return dimensions.width < MOBILE_CUTOFF;
}