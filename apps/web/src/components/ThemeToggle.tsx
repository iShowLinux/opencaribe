'use client';

import { useEffect, useState } from "react";

export function ThemeToggle({ labels }: { labels: { light: string; dark: string; theme: string } }) {
  const [gta, setGta] = useState(false);

  useEffect(() => {
    const sync = () => setGta(document.documentElement.classList.contains('theme-gta'));
    sync();
    window.addEventListener('oc-theme-change', sync);
    return () => window.removeEventListener('oc-theme-change', sync);
  }, []);

  if (gta) {
    return (
      <button
        type="button"
        onClick={() => {
          document.documentElement.classList.remove('theme-gta');
          try { localStorage.setItem('opencaribe-gta', '0'); } catch { /* ignore */ }
          window.dispatchEvent(new Event('oc-theme-change'));
        }}
        aria-label={labels.theme}
        title={labels.theme}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-lime-400 bg-purple-950 text-lg text-lime-300"
      >
        <span aria-hidden="true">🌴</span>
        <span className="sr-only">{labels.theme}</span>
      </button>
    );
  }

  function toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('opencaribe-theme', isDark ? 'dark' : 'light');
    } catch {
      // Storage may be unavailable in private browsing; the theme still applies for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={labels.theme}
      title={labels.theme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <span aria-hidden="true" className="hidden text-lg dark:inline">☀</span>
      <span aria-hidden="true" className="text-lg dark:hidden">☾</span>
      <span className="sr-only">{labels.theme}</span>
    </button>
  );
}
