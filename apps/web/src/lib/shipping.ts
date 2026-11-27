export interface ShippingQuoteInput {
  originZip: string;
  destinationZip: string;
  weightOz: number;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
}

export interface ShippingRate {
  service: string;
  carrier: string;
  total: string;
  etaDays?: string;
}

/**
 * Fetches a rate matrix from the optional shipping provider adapter.
 * When SHIP_PROVIDER_URL is not configured this returns null so the UI can
 * fall back to direct label creation on Pirate Ship instead of inventing rates.
 */
export async function fetchShippingRates(input: ShippingQuoteInput): Promise<ShippingRate[] | null> {
  const provider = process.env.SHIP_PROVIDER_URL;
  if (!provider) return null;
  try {
    const response = await fetch(provider, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { rates?: ShippingRate[] };
    return Array.isArray(payload.rates) ? payload.rates : null;
  } catch {
    return null;
  }
}
