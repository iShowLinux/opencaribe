"use client";

import { useEffect, useRef, useState } from "react";

interface ChatRow {
  id: string;
  name: string | null;
  body: string;
  createdAt: string;
}

export function ChatRoom() {
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const response = await fetch("/api/chat", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { messages?: ChatRow[] };
        if (!cancelled && Array.isArray(payload.messages)) setRows(payload.messages);
      } catch {
        /* retry next tick */
      }
    }
    void poll();
    const timer = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [rows.length]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    setError("");
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Could not send.");
    } else {
      setBody("");
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-4">
      <div ref={boxRef} className="h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        {rows.length === 0 && <p className="text-sm text-slate-500">No messages yet — say hello.</p>}
        <ul className="grid gap-2">
          {rows.map((row) => (
            <li key={row.id} className="text-sm">
              <span className="font-semibold text-navy-900 dark:text-navy-50">{row.name ?? "Member"}</span>
              <span className="ml-2 text-xs text-slate-400">{new Date(row.createdAt).toLocaleTimeString()}</span>
              <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{row.body}</p>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={300}
          placeholder="Message the room…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-navy-50"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>
      {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    </div>
  );
}
