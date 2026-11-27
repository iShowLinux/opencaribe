"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@opencaribe/ui";
import { submitReplyAction, type ThreadFormState } from "@/app/community-actions";

const initial: ThreadFormState = { status: "idle" };

export function ReplyForm({ threadId }: { threadId: string }) {
  const t = useTranslations("community");
  const [state, action, pending] = useActionState(submitReplyAction, initial);
  return (
    <form action={action} className="mt-5 grid gap-2">
      <input type="hidden" name="threadId" value={threadId} />
      <textarea
        name="body"
        required
        minLength={2}
        maxLength={4000}
        rows={3}
        placeholder={t("replyPlaceholder")}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-navy-50"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{t("replyNote")}</p>
        <Button type="submit" disabled={pending}>{pending ? "…" : t("reply")}</Button>
      </div>
      {state.status === "error" && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{state.message}</p>}
    </form>
  );
}
