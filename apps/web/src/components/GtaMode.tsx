"use client";

import { useEffect, useReducer } from "react";

const STORAGE_KEY = "opencaribe-gta";

export function setGtaMode(on: boolean) {
  try {
    document.documentElement.classList.toggle("theme-gta", on);
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event("oc-theme-change"));
}

function currentGta(): boolean {
  return typeof window !== "undefined" && document.documentElement.classList.contains("theme-gta");
}

/**
 * Easter egg: typing "/gta" anywhere on the site switches to a GTA-style
 * purple/lime theme (a third mode next to light and dark). Type it again to exit.
 */
export function GtaMode() {
  const [, forceRender] = useReducer((value: number) => value + 1, 0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setGtaMode(true);
    } catch {
      /* ignore */
    }
    if (new URLSearchParams(window.location.search).get("gta")) setGtaMode(true);

    let buffer = "";
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) return;
      buffer = (buffer + event.key).slice(-12).toLowerCase();
      if (buffer.includes("/gta")) {
        buffer = "";
        setGtaMode(!currentGta());
      }
    }
    function onThemeChange() {
      forceRender();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("oc-theme-change", onThemeChange);
    forceRender();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("oc-theme-change", onThemeChange);
    };
  }, []);

  if (!currentGta()) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border-2 border-lime-400 bg-purple-950/90 px-4 py-2 text-xs font-black uppercase tracking-widest text-lime-300 shadow-lg">
      GTA mode · type <span className="text-white">/gta</span> to exit
    </div>
  );
}
