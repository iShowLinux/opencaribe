"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card } from "@opencaribe/ui";
import { submitThreadAction, type ThreadFormState } from "@/app/community-actions";

const initial: ThreadFormState = { status: "idle" };

export function NewThreadForm() {
  const t = useTranslations("community");
  const router = useRouter();
  const [state, action, pending] = useActionState(submitThreadAction, initial);

  if (state.status === "success" && state.message) {
    router.push(`/community/${state.message}`);
    return null;
  }

  const selectCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900";
  const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-navy-50";
  return (
    <Card className="mt-6 p-6">
      <h2 className="text-base font-semibold text-navy-900 dark:text-navy-50">{t("newThread")}</h2>
      <form action={action} className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm font-medium">
          {t("category")}
          <select name="category" className={selectCls} defaultValue="events">
            <option value="events">{t("catEvents")}</option>
            <option value="feedback">{t("catFeedback")}</option>
            <option value="support">{t("catSupport")}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {t("title")}
          <input name="title" required minLength={3} maxLength={200} className={inputCls} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {t("body")}
          <textarea name="body" required minLength={3} maxLength={4000} rows={4} className={inputCls} />
        </label>
        <Button type="submit" disabled={pending}>{pending ? "…" : t("post")}</Button>
        {state.status === "error" && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{state.message}</p>}
      </form>
    </Card>
  );
}
