import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import track from "@lib/tracker";

export function usePageTracking() {
  const location = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    if (lastPath.current === location.pathname + location.search) return;
    lastPath.current = location.pathname + location.search;
    track.pageview(location.pathname + location.search, document.title);
  }, [location.pathname, location.search]);
}

export function useTrackOnMount(eventName, payload) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track.event(eventName, payload);
  }, [eventName]);
}

export function useTrackEvent() {
  return (type, payload) => track.event(type, payload);
}

export { track };
