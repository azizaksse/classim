import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
    __fbPixelsInited?: Set<string>;
  }
}

const parseEnvPixelIds = () => {
  const raw = import.meta.env.VITE_FACEBOOK_PIXEL_IDS || "";
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
};

const ensurePixelScript = () => {
  if (window.fbq) return;

  ((f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: HTMLScriptElement) => {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0] as HTMLScriptElement;
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
};

const AnalyticsBridge = () => {
  const location = useLocation();
  const storeSettings = useQuery(api.settings.get);
  const isAdminRoute = location.pathname.startsWith("/admin");

  const pixelIds = useMemo(() => {
    const fromDb = storeSettings?.facebook_pixels ?? [];
    const fromEnv = parseEnvPixelIds();
    return Array.from(new Set([...fromDb, ...fromEnv]));
  }, [storeSettings?.facebook_pixels]);

  useEffect(() => {
    if (isAdminRoute) return;
    if (!pixelIds.length) return;
    ensurePixelScript();

    if (!window.__fbPixelsInited) {
      window.__fbPixelsInited = new Set<string>();
    }

    for (const id of pixelIds) {
      if (!window.__fbPixelsInited.has(id)) {
        window.fbq?.("init", id);
        window.__fbPixelsInited.add(id);
      }
    }
  }, [isAdminRoute, pixelIds]);

  useEffect(() => {
    if (isAdminRoute) return;
    if (!pixelIds.length) return;
    window.fbq?.("track", "PageView");
  }, [isAdminRoute, location.pathname, location.search, pixelIds]);

  return null;
};

export default AnalyticsBridge;
