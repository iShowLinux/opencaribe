"use server";

import { fetchShippingRates } from '@/lib/shipping';

export interface ShipState {
  status: 'idle' | 'error' | 'success';
  message?: string;
  rates?: Array<{ service: string; carrier: string; total: string; etaDays?: string }>;
}

export async function quoteShipment(_previous: ShipState, formData: FormData): Promise<ShipState> {
  const num = (key: string) => Number(String(formData.get(key) ?? '').trim());
  const input = {
    originZip: String(formData.get('originZip') ?? '').trim(),
    destinationZip: String(formData.get('destinationZip') ?? '').trim(),
    weightOz: num('weightOz'),
    lengthIn: num('lengthIn') || 1,
    widthIn: num('widthIn') || 1,
    heightIn: num('heightIn') || 1,
  };
  if (!input.originZip || !input.destinationZip) return { status: 'error', message: 'Enter both postal codes.' };
  if (!Number.isFinite(input.weightOz) || input.weightOz <= 0) return { status: 'error', message: 'Enter a valid weight in ounces.' };

  const rates = await fetchShippingRates(input);
  if (!rates) {
    return {
      status: 'success',
      message: 'No carrier account is connected yet, so live rates are unavailable. Open Pirate Ship below to create the label there.',
      rates: [],
    };
  }
  return { status: 'success', message: `${rates.length} services returned.`, rates };
}
