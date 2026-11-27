"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge, Button, Card } from "@opencaribe/ui";
import { updateWhatsappAction } from "@/app/actions";
import { useRouter } from "next/navigation";

export function ContactCard({ whatsapp }: { whatsapp?: string }) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [value, setValue] = useState(whatsapp ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setMessage("");
    const data = new FormData();
    data.set("whatsapp", value);
    const result = await updateWhatsappAction(data);
    setMessage(result.message);
    setBusy(false);
    router.refresh();
  }

  const digits = value.replace(/[^0-9]/g, "");

  return (
    <Card className="mt-6 p-6" id="whatsapp">
      <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t("whatsappTitle")}</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("whatsappHint")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          inputMode="tel"
          placeholder="+1 868 555 0123"
          aria-label={t("whatsappTitle")}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-navy-50"
        />
        <Button type="button" onClick={() => void save()} disabled={busy}>{busy ? "…" : t("whatsappSave")}</Button>
      </div>
      {message && <p role="status" className="mt-2 text-xs text-slate-500">{message}</p>}
      {whatsapp && digits.length > 0 && (
        <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="mt-3 inline-block">
          <Badge tone="success">wa.me/{digits}</Badge>
        </a>
      )}
    </Card>
  );
}
