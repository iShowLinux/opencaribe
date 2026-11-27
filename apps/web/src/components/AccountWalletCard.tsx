"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge, Button, Card } from "@opencaribe/ui";
import { connectAdenaWallet, displayAddress } from "@/lib/wallet";
import { connectWalletAction } from "@/app/actions";

export function AccountWalletCard({ linkedAddress }: { linkedAddress?: string }) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function connect() {
    setBusy(true);
    setError("");
    try {
      const account = await connectAdenaWallet();
      const result = await connectWalletAction(account.address);
      if (!result.ok) setError(result.message);
      else router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("walletError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mt-6 p-6" id="wallet">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t("wallet")}</h2>
          {linkedAddress ? (
            <Badge tone="success" className="mt-2">{displayAddress(linkedAddress)}</Badge>
          ) : (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("walletConnectHint")}</p>
          )}
        </div>
        <Button type="button" onClick={connect} disabled={busy} variant={linkedAddress ? "secondary" : "primary"}>
          {busy ? "…" : linkedAddress ? t("walletSwitch") : t("walletConnect")}
        </Button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    </Card>
  );
}
