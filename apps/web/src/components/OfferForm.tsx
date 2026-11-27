"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button, Card, Textarea } from "@opencaribe/ui";
import { submitOfferAction, type OfferFormState } from "@/app/offer-actions";

const initial: OfferFormState = { status: "idle" };

interface Props {
  listingId: string;
  currency: string;
  askingMajor: string;
  digits: number;
  loggedIn: boolean;
}

export function OfferForm({ listingId, currency, askingMajor, digits, loggedIn }: Props) {
  const t = useTranslations("offer");
  const [state, action, pending] = useActionState(submitOfferAction, initial);

  return (
    <Card className="mt-4 p-5">
      <h2 className="text-base font-semibold text-navy-900 dark:text-navy-50">{t("title")}</h2>
      {!loggedIn ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t("signInHint")}</p>
      ) : (
        <form action={action} className="mt-3 grid gap-3">
          <input type="hidden" name="listingId" value={listingId} />
          <label htmlFor="amount" className="grid gap-1 text-sm font-medium text-navy-900 dark:text-navy-50">
            {t("amount", { currency })}
            <input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step={10 ** -digits}
              defaultValue={askingMajor}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-navy-50"
            />
          </label>
          <Textarea id="message" name="message" maxLength={500} rows={3} placeholder={t("messagePlaceholder")} />
          <Button type="submit" disabled={pending}>{pending ? "…" : t("submit")}</Button>
          {state.status === "success" && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{state.message}</p>}
          {state.status === "error" && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{state.message}</p>}
        </form>
      )}
    </Card>
  );
}
