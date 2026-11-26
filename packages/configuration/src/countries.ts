import type { CountryCode, CountryConfig, LocalizedText } from './types';

const t = (en: string, es: string): LocalizedText => ({ en, es });

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  TT: {
    code: 'TT',
    displayName: 'Trinidad and Tobago',
    supportedLanguages: ['en', 'es'],
    defaultLocale: 'en',
    supportedCurrencies: ['TTD', 'USD'],
    defaultCurrency: 'TTD',
    telephonePrefix: '+1-868',
    timeZone: 'America/Port_of_Spain',
    regions: [
      {
        id: 'tt-port-of-spain',
        names: t('Port of Spain', 'Puerto de España'),
        cities: [
          { id: 'tt-pos-city', names: t('Port of Spain', 'Puerto de España'), approxLatitude: 10.6487, approxLongitude: -61.5189 },
          { id: 'tt-woodbrook', names: t('Woodbrook', 'Woodbrook'), approxLatitude: 10.6465, approxLongitude: -61.5321 },
        ],
      },
      {
        id: 'tt-san-fernando',
        names: t('San Fernando', 'San Fernando'),
        cities: [
          { id: 'tt-sfo-city', names: t('San Fernando', 'San Fernando'), approxLatitude: 10.2866, approxLongitude: -61.4601 },
        ],
      },
      {
        id: 'tt-chaguanas',
        names: t('Chaguanas', 'Chaguanas'),
        cities: [
          { id: 'tt-chaguanas-city', names: t('Chaguanas', 'Chaguanas'), approxLatitude: 10.5209, approxLongitude: -61.4049 },
        ],
      },
      {
        id: 'tt-arima',
        names: t('Arima', 'Arima'),
        cities: [
          { id: 'tt-arima-city', names: t('Arima', 'Arima'), approxLatitude: 10.6359, approxLongitude: -61.2787 },
        ],
      },
      {
        id: 'tt-tunapuna-piarco',
        names: t('Tunapuna–Piarco', 'Tunapuna–Piarco'),
        cities: [
          { id: 'tt-tunapuna', names: t('Tunapuna', 'Tunapuna'), approxLatitude: 10.6275, approxLongitude: -61.3485 },
          { id: 'tt-piarco', names: t('Piarco', 'Piarco'), approxLatitude: 10.5833, approxLongitude: -61.3333 },
        ],
      },
      {
        id: 'tt-couva-tabaquite-talparo',
        names: t('Couva–Tabaquite–Talparo', 'Couva–Tabaquite–Talparo'),
        cities: [
          { id: 'tt-couva', names: t('Couva', 'Couva'), approxLatitude: 10.4077, approxLongitude: -61.4509 },
        ],
      },
      {
        id: 'tt-diego-martin',
        names: t('Diego Martin', 'Diego Martin'),
        cities: [
          { id: 'tt-diego-martin-city', names: t('Diego Martin', 'Diego Martin'), approxLatitude: 10.7131, approxLongitude: -61.5428 },
        ],
      },
      {
        id: 'tt-tobago',
        names: t('Tobago', 'Tobago'),
        cities: [
          { id: 'tt-scarborough', names: t('Scarborough', 'Scarborough'), approxLatitude: 11.1868, approxLongitude: -60.7395 },
          { id: 'tt-lowlands', names: t('Lowlands', 'Lowlands'), approxLatitude: 11.2347, approxLongitude: -60.8247 },
        ],
      },
    ],
    enabledCategories: ['*'],
    featureFlags: {
      requireEmailVerification: true,
      allowGuestBrowsing: true,
      enableMessaging: true,
      enableMapSearch: false,
      enableLocationDetection: false,
      moderationQueue: true,
      maxImagesPerListing: 8,
      listingExpirationDays: 30,
      maxListingTitleLength: 100,
      maxListingDescriptionLength: 5000,
    },
    cryptoPayments: {
      enabled: false,
      comingSoon: true,
      wallets: ['adena'],
      note: t(
        'Paying with GNOT is not enabled yet. Connect your Adena wallet to see your testnet balance and be ready when payments launch.',
        'Pagar con GNOT aún no está habilitado. Conecta tu billetera Adena para ver tu saldo de prueba y estar listo cuando se lancen los pagos.',
      ),
      asset: { symbol: 'GNOT', denom: 'ugnot', decimals: 6 },
      walletConnect: {
        enabled: true,
        network: 'testnet',
        chainId: 'onyx-1',
        rpcUrl: 'https://rpc.onyx.testnets.gno.land:443',
        faucetUrl: 'https://faucet.gno.land',
      },
    },
    legalDocuments: {
      privacyPolicy: 'privacyPolicy',
      termsOfService: 'termsOfService',
      communityGuidelines: 'communityGuidelines',
    },
    moderation: {
      requiresApprovalCategories: ['housing', 'jobs'],
      prohibitedItemKeys: ['weapons', 'controlledSubstances', 'counterfeit', 'humanTrafficking', 'stolenGoods'],
      allowUsedGoods: true,
      allowTobaccoAndAlcohol: false,
      notes: 'Category-specific rules are maintained in docs/security and must be reviewed with local counsel before launch.',
    },
  },

  VE: {
    code: 'VE',
    displayName: 'Venezuela',
    supportedLanguages: ['es', 'en'],
    defaultLocale: 'es',
    supportedCurrencies: ['VES', 'USD'],
    defaultCurrency: 'VES',
    telephonePrefix: '+58',
    timeZone: 'America/Caracas',
    regions: [
      {
        id: 've-capital',
        names: t('Capital District', 'Distrito Capital'),
        cities: [
          { id: 've-caracas', names: t('Caracas', 'Caracas'), approxLatitude: 10.4806, approxLongitude: -66.9036 },
          { id: 've-libertador', names: t('Libertador', 'Libertador'), approxLatitude: 10.4883, approxLongitude: -66.8792 },
        ],
      },
      {
        id: 've-miranda',
        names: t('Miranda', 'Miranda'),
        cities: [
          { id: 've-los-teques', names: t('Los Teques', 'Los Teques'), approxLatitude: 10.3442, approxLongitude: -67.0339 },
          { id: 've-catia', names: t('Catia de Los Teques', 'Catia de Los Teques'), approxLatitude: 10.3547, approxLongitude: -67.0425 },
        ],
      },
      {
        id: 've-zulia',
        names: t('Zulia', 'Zulia'),
        cities: [
          { id: 've-maracaibo', names: t('Maracaibo', 'Maracaibo'), approxLatitude: 10.6513, approxLongitude: -71.6363 },
          { id: 've-cabimas', names: t('Cabimas', 'Cabimas'), approxLatitude: 10.7653, approxLongitude: -71.4551 },
        ],
      },
      {
        id: 've-carabobo',
        names: t('Carabobo', 'Carabobo'),
        cities: [
          { id: 've-valencia', names: t('Valencia', 'Valencia'), approxLatitude: 10.1632, approxLongitude: -68.0067 },
        ],
      },
      {
        id: 've-aragua',
        names: t('Aragua', 'Aragua'),
        cities: [
          { id: 've-maracay', names: t('Maracay', 'Maracay'), approxLatitude: 10.2461, approxLongitude: -67.6065 },
        ],
      },
      {
        id: 've-lara',
        names: t('Lara', 'Lara'),
        cities: [
          { id: 've-barquisimeto', names: t('Barquisimeto', 'Barquisimeto'), approxLatitude: 10.0703, approxLongitude: -69.3318 },
        ],
      },
      {
        id: 've-merida',
        names: t('Mérida', 'Mérida'),
        cities: [
          { id: 've-merida-city', names: t('Mérida', 'Mérida'), approxLatitude: 8.1166, approxLongitude: -71.3536 },
        ],
      },
      {
        id: 've-tachira',
        names: t('Táchira', 'Táchira'),
        cities: [
          { id: 've-san-cristobal', names: t('San Cristóbal', 'San Cristóbal'), approxLatitude: 7.7669, approxLongitude: -72.2222 },
        ],
      },
      {
        id: 've-bolivar',
        names: t('Bolívar', 'Bolívar'),
        cities: [
          { id: 've-puerto-ordaz', names: t('Puerto Ordaz', 'Puerto Ordaz'), approxLatitude: 8.2784, approxLongitude: -62.7521 },
        ],
      },
      {
        id: 've-nueva-esparta',
        names: t('Nueva Esparta', 'Nueva Esparta'),
        cities: [
          { id: 've-porlamar', names: t('Porlamar', 'Porlamar'), approxLatitude: 10.9584, approxLongitude: -63.8441 },
        ],
      },
    ],
    enabledCategories: ['*'],
    featureFlags: {
      requireEmailVerification: true,
      allowGuestBrowsing: true,
      enableMessaging: true,
      enableMapSearch: false,
      enableLocationDetection: false,
      moderationQueue: true,
      maxImagesPerListing: 8,
      listingExpirationDays: 30,
      maxListingTitleLength: 100,
      maxListingDescriptionLength: 5000,
    },
    cryptoPayments: {
      enabled: false,
      comingSoon: true,
      wallets: ['adena'],
      note: t(
        'Paying with GNOT is not enabled yet. Connect your Adena wallet to see your testnet balance and be ready when payments launch.',
        'Pagar con GNOT aún no está habilitado. Conecta tu billetera Adena para ver tu saldo de prueba y estar listo cuando se lancen los pagos.',
      ),
      asset: { symbol: 'GNOT', denom: 'ugnot', decimals: 6 },
      walletConnect: {
        enabled: true,
        network: 'testnet',
        chainId: 'onyx-1',
        rpcUrl: 'https://rpc.onyx.testnets.gno.land:443',
        faucetUrl: 'https://faucet.gno.land',
      },
    },
    legalDocuments: {
      privacyPolicy: 'privacyPolicy',
      termsOfService: 'termsOfService',
      communityGuidelines: 'communityGuidelines',
    },
    moderation: {
      requiresApprovalCategories: ['housing', 'jobs', 'vehicles'],
      prohibitedItemKeys: ['weapons', 'controlledSubstances', 'counterfeit', 'humanTrafficking', 'stolenGoods', 'fuel'],
      allowUsedGoods: true,
      allowTobaccoAndAlcohol: false,
      notes: 'VES and VED must remain distinct in any historical record. Confirm current currency rules before enabling paid features.',
    },
  },
};

export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export function getCountry(code: string): CountryConfig | undefined {
  return COUNTRIES[code as CountryCode];
}

/** Normalises URL segments (e.g. '/tt') to the canonical country code. */
export function toCountryCode(value: string): CountryCode | undefined {
  const normalized = value.trim().toUpperCase();
  return normalized in COUNTRIES ? (normalized as CountryCode) : undefined;
}

export function isCountryCode(code: string): code is CountryCode {
  return toCountryCode(code) !== undefined;
}

export function defaultLocaleForCountry(code: CountryCode) {
  return COUNTRIES[code].defaultLocale;
}
