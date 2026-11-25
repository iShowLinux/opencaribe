import { Button, Input, Label, Select } from '@opencaribe/ui';
import { getT } from '@/lib/t';

export interface SearchOption { value: string; label: string }

export async function SearchForm({
  action,
  categories,
  regions,
  cities,
  currencies,
  defaults = {},
}: {
  action: string;
  categories: SearchOption[];
  regions: SearchOption[];
  cities: SearchOption[];
  currencies: SearchOption[];
  defaults?: Record<string, string>;
}) {
  const t = await getT();
  const inputClass = 'w-full';

  return (
    <form action={action} method="get" className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-4">
        <Label htmlFor="q">{t('search.keyword')}</Label>
        <Input id="q" name="q" defaultValue={defaults.q ?? ''} placeholder={t('search.keyword')} />
      </div>
      <div>
        <Label htmlFor="category">{t('search.category')}</Label>
        <Select id="category" name="category" defaultValue={defaults.category ?? ''}>
          <option value="">{t('common.all')}</option>
          {categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="region">{t('search.region')}</Label>
        <Select id="region" name="region" defaultValue={defaults.region ?? ''}>
          <option value="">{t('common.all')}</option>
          {regions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="city">{t('search.city')}</Label>
        <Select id="city" name="city" defaultValue={defaults.city ?? ''}>
          <option value="">{t('common.all')}</option>
          {cities.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="currency">{t('search.currency')}</Label>
        <Select id="currency" name="currency" defaultValue={defaults.currency ?? ''}>
          <option value="">{t('common.all')}</option>
          {currencies.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="minPrice">{t('search.minPrice')}</Label>
        <Input id="minPrice" name="minPrice" inputMode="decimal" defaultValue={defaults.minPrice ?? ''} className={inputClass} />
      </div>
      <div>
        <Label htmlFor="maxPrice">{t('search.maxPrice')}</Label>
        <Input id="maxPrice" name="maxPrice" inputMode="decimal" defaultValue={defaults.maxPrice ?? ''} className={inputClass} />
      </div>
      <div>
        <Label htmlFor="sort">{t('search.sort')}</Label>
        <Select id="sort" name="sort" defaultValue={defaults.sort ?? 'recent'}>
          <option value="recent">{t('search.recent')}</option>
          <option value="relevance">{t('search.relevance')}</option>
          <option value="price_asc">{t('search.priceAsc')}</option>
          <option value="price_desc">{t('search.priceDesc')}</option>
        </Select>
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">{t('search.apply')}</Button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 sm:col-span-2 lg:col-span-4">{t('search.currencyNote')}</p>
    </form>
  );
}
