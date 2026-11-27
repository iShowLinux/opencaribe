export type Locale = 'en' | 'es';
export type CountryCode =
  | 'TT'
  | 'VE'
  | 'JM'
  | 'BB'
  | 'GY'
  | 'BS'
  | 'DO'
  | 'HT'
  | 'PR'
  | 'CU'
  | 'BZ'
  | 'AG'
  | 'LC'
  | 'GD'
  | 'DM'
  | 'VC'
  | 'KN'
  | 'SR'
  | 'AW'
  | 'CW'
  | 'VI'
  | 'VG'
  | 'KY'
  | 'TC'
  | 'MS'
  | 'AI'
  | 'SX'
  | 'MQ'
  | 'GP'
  | 'GF'
  | 'BQ'
  | 'CO'
  | 'PA';
export type CurrencyCode =
  | 'TTD'
  | 'USD'
  | 'VED'
  | 'VES'
  | 'GNOT'
  | 'JMD'
  | 'BBD'
  | 'GYD'
  | 'BSD'
  | 'DOP'
  | 'HTG'
  | 'CUP'
  | 'BZD'
  | 'XCD'
  | 'SRD'
  | 'AWG'
  | 'ANG'
  | 'EUR'
  | 'KYD'
  | 'COP'
  | 'PAB';
export type LocalizedText = Record<Locale, string>;

export interface CurrencyDefinition {
  code: CurrencyCode;
  digits: number;
  symbol: string;
  name: LocalizedText;
  note?: string;
}

export interface CityConfig {
  id: string;
  names: LocalizedText;
  approxLatitude?: number;
  approxLongitude?: number;
}

export interface RegionConfig {
  id: string;
  names: LocalizedText;
  cities: CityConfig[];
}

export interface CountryFeatureFlags {
  requireEmailVerification: boolean;
  allowGuestBrowsing: boolean;
  enableMessaging: boolean;
  enableMapSearch: boolean;
  enableLocationDetection: boolean;
  moderationQueue: boolean;
  maxImagesPerListing: number;
  listingExpirationDays: number;
  maxListingTitleLength: number;
  maxListingDescriptionLength: number;
}

export interface CryptoAssetConfig {
  symbol: string;
  denom: string;
  decimals: number;
}

export interface WalletConnectConfig {
  enabled: boolean;
  network: 'testnet' | 'mainnet';
  chainId: string;
  rpcUrl: string;
  faucetUrl: string;
}

export interface CryptoPaymentConfig {
  /** True only when on-chain settlement is live. Phase 1 keeps this false. */
  enabled: boolean;
  comingSoon: boolean;
  wallets: string[];
  note: LocalizedText;
  asset: CryptoAssetConfig;
  walletConnect: WalletConnectConfig;
}

export interface ModerationPolicy {
  requiresApprovalCategories: string[];
  prohibitedItemKeys: string[];
  allowUsedGoods: boolean;
  allowTobaccoAndAlcohol: boolean;
  notes: string;
}

export interface CountryConfig {
  code: CountryCode;
  displayName: string;
  supportedLanguages: Locale[];
  defaultLocale: Locale;
  supportedCurrencies: CurrencyCode[];
  defaultCurrency: CurrencyCode;
  telephonePrefix: string;
  timeZone: string;
  regions: RegionConfig[];
  enabledCategories: string[];
  featureFlags: CountryFeatureFlags;
  cryptoPayments: CryptoPaymentConfig;
  legalDocuments: {
    privacyPolicy: string;
    termsOfService: string;
    communityGuidelines: string;
  };
  moderation: ModerationPolicy;
}
