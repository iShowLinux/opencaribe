"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sends one anonymous page-view beacon per navigation. Never throws. */
export function StatsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const payload = JSON.stringify({ path: pathname, country: undefined, referrer: document.referrer || undefined });
      navigator.sendBeacon("/api/stats", new Blob([payload], { type: "application/json" }));
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
