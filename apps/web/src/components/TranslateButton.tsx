"use client";

import { useState } from "react";
import { translateText } from "@/app/translate-actions";

export function TranslateButton({ text, target }: { text: string; target: "en" | "es" }) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    if (translation) return;
    setBusy(true);
    const result = await translateText(text, target);
    setTranslation(result || "—");
    setBusy(false);
  }

  return (
    <span className="mt-1 block">
      <button
        type="button"
        onClick={() => void run()}
        disabled={busy}
        className="text-[10px] font-medium text-teal-700 underline underline-offset-2 hover:no-underline disabled:opacity-60 dark:text-teal-300"
      >
        {busy ? "…" : translation ? "" : `Translate to ${target.toUpperCase()}`}
      </button>
      {translation && <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-400">· {translation}</span>}
    </span>
  );
}
