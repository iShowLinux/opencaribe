'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { CURRENCIES, formatMoney, parseMoneyToMinor, type CurrencyCode, type Locale } from '@opencaribe/configuration';
import { Badge, Button, Card, Input, Label, Select, Textarea } from '@opencaribe/ui';
import { submitListing, type SubmitState } from '@/app/actions';
import { WalletConnectBar } from '@/components/WalletConnectBar';
import type { WalletAccount } from '@/lib/wallet';

interface CategoryOption {
  id: string;
  slug: string;
  names: Record<Locale, string>;
  subcategories: Array<{ id: string; slug: string; names: Record<Locale, string> }>;
}

interface Props {
  countryCode: string;
  locale: Locale;
  signedIn: boolean;
  categories: CategoryOption[];
  regions: Array<{ id: string; names: Record<Locale, string> }>;
  currencies: string[];
}

const initialState: SubmitState = { status: 'idle' };

export function PostListingWizard({ countryCode, locale, signedIn, categories, regions, currencies }: Props) {
  const t = useTranslations('post');
  const root = useTranslations();
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState(currencies[0] ?? 'TTD');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoryId, setSubcategoryId] = useState(categories[0]?.subcategories[0]?.id ?? '');
  const [imageData, setImageData] = useState('');
  const [imageName, setImageName] = useState('');
  const [regionId, setRegionId] = useState(regions[0]?.id ?? '');
  const [cityId, setCityId] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [state, formAction, pending] = useActionState(submitListing, initialState);
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const safeCurrency = currency in CURRENCIES ? (currency as CurrencyCode) : 'TTD';
  const fieldError = (key: string): string | undefined => state.errors?.[key]?.[0];
  const invalidBorder = 'border-rose-500 focus-visible:ring-rose-500';

  // When a submission fails, surface the failing step immediately by deriving
  // the visible step during render (no effect-based navigation).
  const errorSignature =
    state.status === 'error' && state.errors ? Object.keys(state.errors).sort().join('|') : '';
  const [acknowledgedSignature, setAcknowledgedSignature] = useState('');
  const effectiveStep =
    errorSignature && errorSignature !== acknowledgedSignature
      ? Object.keys(state.errors ?? {}).some((key) =>
          ['title', 'description', 'price', 'currency', 'priceType', 'condition'].includes(key),
        )
        ? 2
        : 1
      : step;

  function goTo(nextStep: number) {
    setAcknowledgedSignature(errorSignature);
    setStep(nextStep);
  }
  const previewPrice = (() => {
    try {
      return formatMoney(parseMoneyToMinor(price || '0', safeCurrency), safeCurrency, locale);
    } catch {
      return price;
    }
  })();

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <input type="hidden" name="countryCode" value={countryCode} />
      {wallet && <input type="hidden" name="walletAddress" value={wallet.address} />}
      {/* Honeypot: hidden from people, attractive to bots. */}
      <input type="hidden" name="imageUrl" value={imageData} />
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <WalletConnectBar account={wallet} onChange={setWallet} />

      <Card className="p-5 sm:p-6">
        <ol className="mb-6 flex flex-col gap-2 text-sm sm:flex-row">
          {[t('step1'), t('step2'), t('step3')].map((label, index) => (
            <li key={label} className={`flex-1 rounded-lg px-3 py-2 text-center font-medium ${effectiveStep === index + 1 ? 'bg-teal-700 text-white dark:bg-teal-500 dark:text-slate-950' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
              {index + 1}. {label}
            </li>
          ))}
        </ol>

        <section hidden={effectiveStep !== 1} className="grid gap-4">
          <div>
            <Label htmlFor="categoryId">{t('categoryLabel')}</Label>
            <Select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => {
                const next = e.target.value;
                setCategoryId(next);
                const nextCategory = categories.find((category) => category.id === next);
                setSubcategoryId(nextCategory?.subcategories[0]?.id ?? '');
              }}
              aria-invalid={Boolean(fieldError('categoryId'))} className={fieldError('categoryId') ? invalidBorder : undefined}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.names[locale]}</option>)}
            </Select>
            {fieldError('categoryId') && <p role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldError('categoryId')}</p>}
          </div>
          <div>
            <Label htmlFor="subcategoryId">{t('step1')}</Label>
            <Select id="subcategoryId" name="subcategoryId" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}
              aria-invalid={Boolean(fieldError('subcategoryId'))} className={fieldError('subcategoryId') ? invalidBorder : undefined}>
              {(selectedCategory?.subcategories ?? []).map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.names[locale]}</option>)}
            </Select>
            {fieldError('subcategoryId') && <p role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldError('subcategoryId')}</p>}
          </div>
          <div>
            <Label htmlFor="regionId">{t('regionLabel')}</Label>
            <Select id="regionId" name="regionId" value={regionId} onChange={(e) => setRegionId(e.target.value)}
              aria-invalid={Boolean(fieldError('regionId'))} className={fieldError('regionId') ? invalidBorder : undefined}>
              {regions.map((region) => <option key={region.id} value={region.id}>{region.names[locale]}</option>)}
            </Select>
            {fieldError('regionId') && <p role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldError('regionId')}</p>}
          </div>
          <div>
            <Label htmlFor="cityId">{t('cityLabel')}</Label>
            <Input id="cityId" name="cityId" value={cityId} onChange={(e) => setCityId(e.target.value)} placeholder="Optional" />
          </div>
        </section>

        <section hidden={effectiveStep !== 2} className="grid gap-4">
          <div>
            <Label htmlFor="title">{t('titleLabel')}</Label>
            <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required
              aria-invalid={Boolean(fieldError('title'))} className={fieldError('title') ? invalidBorder : undefined} />
            {fieldError('title') && <p role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldError('title')}</p>}
          </div>
          <div>
            <Label htmlFor="description">{t('descriptionLabel')}</Label>
            <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)}
              minLength={20} maxLength={5000} required
              aria-invalid={Boolean(fieldError('description'))} className={fieldError('description') ? invalidBorder : undefined} />
            {fieldError('description') && <p role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldError('description')}</p>}
          </div>
          <div>
              <Label htmlFor="imageFile">{root('listing.imageLabel')}</Label>
              <input
                id="imageFile"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-1.5 w-full text-sm"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return;
                  if (file.size > 1_500_000) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImageData(String(reader.result ?? ''));
                    setImageName(file.name);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              {imageData && (
                <div className="mt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local data-URL preview */}
                  <img src={imageData} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <span className="text-xs text-slate-500">{imageName}</span>
                  <button type="button" className="text-xs font-medium text-rose-600 hover:underline" onClick={() => { setImageData(''); setImageName(''); }}>
                    {root('listing.remove')}
                  </button>
                </div>
              )}
              <p className="mt-1.5 text-xs text-slate-500">{root('listing.imageHint')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">{t('priceLabel')}</Label>
              <Input id="price" name="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)}
                aria-invalid={Boolean(fieldError('price'))} className={fieldError('price') ? invalidBorder : undefined} />
              {fieldError('price')
                ? <p role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldError('price')}</p>
                : (!price || Number(price.replace(',', '.')) <= 0) && (
                  <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{t('priceHint')}</p>
                )}
            </div>
            <div>
              <Label htmlFor="currency">{t('currencyLabel')}</Label>
              <Select id="currency" name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map((code) => <option key={code} value={code}>{code}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="priceType">{t('priceTypeLabel')}</Label>
              <Select id="priceType" name="priceType" value={priceType} onChange={(e) => setPriceType(e.target.value)}>
                <option value="fixed">Fixed</option>
                <option value="negotiable">Negotiable</option>
                <option value="free">Free</option>
                <option value="contact">Contact for price</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition">{t('conditionLabel')}</Label>
              <Select id="condition" name="condition" defaultValue="good">
                <option value="new">New</option>
                <option value="like_new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="for_parts">For parts</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="contactPreference">{t('contactLabel')}</Label>
            <Select id="contactPreference" name="contactPreference" defaultValue="in_app_messages">
              <option value="in_app_messages">In-app messages</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentMethod">{root('payment.preferredMethod')}</Label>
            <Select id="paymentMethod" name="paymentMethod" defaultValue="cash">
              <option value="cash">{root('payment.methods.cash')}</option>
              <option value="transfer">{root('payment.methods.transfer')}</option>
              <option value="crypto" disabled>{root('payment.methods.crypto')}</option>
            </Select>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{root('payment.walletNote')}</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="negotiable" value="true" /> {root('listing.negotiable')}
          </label>
        </section>

        <section hidden={effectiveStep !== 3} className="grid gap-3">
          <p className="font-semibold text-navy-900 dark:text-navy-50">{title || '—'}</p>
          <p className="text-2xl font-bold text-teal-800 dark:text-teal-300">{previewPrice}</p>
          <Badge tone={wallet || signedIn ? 'success' : 'warning'}>{wallet || signedIn ? t('walletPublishes') : t('draftNote')}</Badge>
          {state.status === 'error' && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{state.message}</p>}
          {state.status === 'success' && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{state.message} #{state.listingId}</p>}
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {effectiveStep > 1 && <Button variant="secondary" onClick={() => goTo(effectiveStep - 1)}>{t('back')}</Button>}
          {effectiveStep < 3 && <Button className="sm:flex-1" onClick={() => goTo(effectiveStep + 1)}>{t('next')}</Button>}
          {effectiveStep === 3 && (
            <Button type="submit" className="sm:flex-1" disabled={pending}>
              {pending ? '…' : wallet ? t('walletPublish') : signedIn ? t('publish') : t('reviewSubmit')}
            </Button>
          )}
        </div>
      </Card>

      <aside className="hidden lg:block">
        <Card className="sticky top-24 p-5">
          <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{t('preview')}</p>
          <p className="mt-3 text-lg font-bold text-teal-800 dark:text-teal-300">{previewPrice}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{title || '—'}</p>
        </Card>
      </aside>
    </form>
  );
}
