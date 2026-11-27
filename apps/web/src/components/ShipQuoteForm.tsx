"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button, Card } from "@opencaribe/ui";
import { quoteShipment, type ShipState } from "@/app/shipping-actions";

const initial: ShipState = { status: "idle" };

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-navy-50";

export function ShipQuoteForm({ defaultDestination }: { defaultDestination?: string }) {
  const t = useTranslations("shipping");
  const [state, action, pending] = useActionState(quoteShipment, initial);
  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold text-navy-900 dark:text-navy-50">{t("title")}</h2>
      <form action={action} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">{t("originZip")}
          <input name="originZip" required className={inputCls} placeholder="70001" />
        </label>
        <label className="grid gap-1 text-sm font-medium">{t("destinationZip")}
          <input name="destinationZip" required defaultValue={defaultDestination ?? ""} className={inputCls} placeholder="90028" />
        </label>
        <label className="grid gap-1 text-sm font-medium">{t("weightOz")}
          <input name="weightOz" type="number" min="0.1" step="0.1" required className={inputCls} />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className="grid gap-1 text-sm font-medium">{t("length")}
            <input name="lengthIn" type="number" min="0.5" step="0.5" className={inputCls} />
          </label>
          <label className="grid gap-1 text-sm font-medium">{t("width")}
            <input name="widthIn" type="number" min="0.5" step="0.5" className={inputCls} />
          </label>
          <label className="grid gap-1 text-sm font-medium">{t("height")}
            <input name="heightIn" type="number" min="0.5" step="0.5" className={inputCls} />
          </label>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>{pending ? "…" : t("quote")}</Button>
        </div>
      </form>
      {state.status !== "idle" && (
        <p role="status" className={`mt-3 text-sm ${state.status === "error" ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-400"}`}>
          {state.message}
        </p>
      )}
      {state.rates && state.rates.length > 0 && (
        <table className="mt-4 w-full text-left text-sm">
          <thead><tr className="text-xs uppercase tracking-wide text-slate-500"><th className="py-1">{t("service")}</th><th className="py-1">{t("carrier")}</th><th className="py-1">{t("eta")}</th><th className="py-1 text-right">{t("total")}</th></tr></thead>
          <tbody>
            {state.rates.map((rate) => (
              <tr key={`${rate.carrier}-${rate.service}`} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-2">{rate.service}</td><td className="py-2">{rate.carrier}</td><td className="py-2">{rate.etaDays ?? "—"}</td><td className="py-2 text-right font-semibold">{rate.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
