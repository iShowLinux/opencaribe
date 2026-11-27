"use client";

import { useTransition } from "react";
import { banUserAction, removeListingAction } from "@/app/mod-actions";

export function RemoveListingButton({ listingId }: { listingId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const data = new FormData();
          data.set("listingId", listingId);
          await removeListingAction(data);
        })
      }
      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}

export function BanUserButton({ userId, banned }: { userId: string; banned: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const data = new FormData();
          data.set("userId", userId);
          data.set("ban", String(!banned));
          await banUserAction(data);
        })
      }
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60 ${
        banned ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
      }`}
    >
      {pending ? "…" : banned ? "Restore" : "Ban"}
    </button>
  );
}
