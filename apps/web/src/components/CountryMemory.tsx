"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Remembers the last market visited so root-level links can deep-link correctly. */
export function CountryMemory() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const match = pathname.match(/^\/(tt|ve)(?:\/|$)/i);
      const code = match?.[1]?.toLowerCase();
      if (code) {
        document.cookie = `oc_country=${code};path=/;max-age=31536000;samesite=lax`;
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
