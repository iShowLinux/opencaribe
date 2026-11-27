import { Badge, Card } from "@opencaribe/ui";
import { getLocale } from "next-intl/server";
import type { Locale } from "@opencaribe/configuration";
import { formatMoney } from "@opencaribe/configuration";
import { getCurrentUser } from "@/lib/session";
import { getListingById } from "@/lib/listings-store";
import { cancelOfferAction, respondOfferAction } from "@/app/offer-actions";
import { listOffersByBuyer, listOffersForSeller } from "@/lib/store";
import { getT } from "@/lib/t";

function tone(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "accepted") return "success";
  if (status === "declined") return "danger";
  if (status === "cancelled") return "neutral";
  return "warning";
}

/** Buyer and seller offer activity on the account dashboard. */
export async function OfferHistory() {
  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const user = await getCurrentUser();
  if (!user) return null;

  const [mine, received] = await Promise.all([
    listOffersByBuyer(user.id),
    listOffersForSeller(`user:${user.id}`),
  ]);
  if (mine.length === 0 && received.length === 0) return null;

  const titles = new Map<string, string>();
  for (const offer of [...mine, ...received]) {
    if (!titles.has(offer.listingId)) {
      const listing = await getListingById(offer.listingId);
      titles.set(offer.listingId, listing?.title ?? "(removed listing)");
    }
  }

  return (
    <>
      {received.length > 0 && (
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t("dashboard.offersReceived")}</h2>
          <div className="mt-4 grid gap-3">
            {received.map((offer) => (
              <div key={offer.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-navy-900 dark:text-navy-50">{titles.get(offer.listingId)}</p>
                  <Badge tone={tone(offer.status)}>{offer.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-teal-700 dark:text-teal-300">
                  {formatMoney(offer.amountMinor, offer.currency as never, locale)} · {new Date(offer.createdAt).toLocaleDateString()}
                </p>
                {offer.message && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{offer.message}</p>}
                {offer.status === "pending" && (
                  <form action={respondOfferAction} className="mt-3 flex gap-2">
                    <input type="hidden" name="offerId" value={offer.id} />
                    <button name="decision" value="accept" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">{t("dashboard.accept")}</button>
                    <button name="decision" value="decline" className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700">{t("dashboard.decline")}</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {mine.length > 0 && (
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t("dashboard.myOffers")}</h2>
          <div className="mt-4 grid gap-3">
            {mine.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="font-medium text-navy-900 dark:text-navy-50">{titles.get(offer.listingId)}</p>
                  <p className="mt-1 text-sm text-teal-700 dark:text-teal-300">
                    {formatMoney(offer.amountMinor, offer.currency as never, locale)} · {new Date(offer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={tone(offer.status)}>{offer.status}</Badge>
                  {offer.status === "pending" && (
                    <form action={cancelOfferAction}>
                      <input type="hidden" name="offerId" value={offer.id} />
                      <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">{t("dashboard.cancel")}</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
