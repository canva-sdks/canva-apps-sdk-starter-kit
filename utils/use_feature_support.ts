import { features } from "@canva/platform";
import type { Feature } from "@canva/platform";
import { useState, useEffect } from "react";

/**
 * This hook allows re-rendering of a React component whenever
 * the state of feature support changes in Canva.
 *
 * @returns isSupported - callback to inspect a Canva SDK method.
 **/
export function useFeatureSupport() {
  // Store a wrapped function that checks feature support
  const [isSupported, setIsSupported] = useState(() => {
    return (...args: Feature[]) => features.isSupported(...args);
  });

  useEffect(() => {
    // create new function ref when feature support changes to trigger
    // re-render
    return features.registerOnSupportChange(() => {
      setIsSupported(() => {
        return (...args: Feature[]) => features.isSupported(...args);
      });
    });
  }, []);

  return isSupported;
}
