import type { CountryCode, CountryConfig, CurrencyCode, Locale, LocalizedText, RegionConfig } from './types';

const t = (en: string, es: string): LocalizedText => ({ en, es });

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  TT: {
    code: 'TT',
    displayName: 'Trinidad and Tobago',
    supportedLanguages: ['en', 'es'],
    defaultLocale: 'en',
    supportedCurrencies: ['TTD', 'USD', 'GNOT'],
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
      enabled: true,
      comingSoon: false,
      wallets: ['adena'],
      note: t(
        'Connect your Adena wallet to pay with GNOT on the onyx testnet. Real mainnet settlement arrives after launch review.',
        'Conecta tu billetera Adena para pagar con GNOT en la red de prueba onyx. El settlements en mainnet llega después del lanzamiento.',
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
    supportedCurrencies: ['VES', 'USD', 'GNOT'],
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
      enabled: true,
      comingSoon: false,
      wallets: ['adena'],
      note: t(
        'Connect your Adena wallet to pay with GNOT on the onyx testnet. Real mainnet settlement arrives after launch review.',
        'Conecta tu billetera Adena para pagar con GNOT en la red de prueba onyx. El settlements en mainnet llega después del lanzamiento.',
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

  JM: {
    code: 'JM',
    displayName: 'Jamaica',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    supportedCurrencies: ['JMD', 'USD', 'GNOT'],
    defaultCurrency: 'JMD',
    telephonePrefix: '+1-876',
    timeZone: 'America/Jamaica',
    regions: [
      {
        id: 'jm-kingston',
        names: t('Kingston', 'Kingston'),
        cities: [
          { id: 'jm-kingston-city', names: t('Kingston', 'Kingston'), approxLatitude: 17.9714, approxLongitude: -76.7922 },
          { id: 'jm-half-way-tree', names: t('Half Way Tree', 'Half Way Tree'), approxLatitude: 18.0125, approxLongitude: -76.796 },
        ],
      },

      {
        id: 'jm-saint-james',
        names: t('Saint James', 'Saint James'),
        cities: [
          { id: 'jm-montego-bay', names: t('Montego Bay', 'Montego Bay'), approxLatitude: 18.4762, approxLongitude: -77.8939 },
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
      enabled: true,
      comingSoon: false,
      wallets: ['adena'],
      note: t(
        'Connect your Adena wallet to pay with GNOT on the onyx testnet. Real mainnet settlement arrives after launch review.',
        'Conecta tu billetera Adena para pagar con GNOT en la red de prueba onyx. El settlements en mainnet llega después del lanzamiento.',
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
      prohibitedItemKeys: ['weapons', 'controlledSubstances', 'counterfeit', 'human_trafficking', 'stolenGoods'],
      allowUsedGoods: true,
      allowTobaccoAndAlcohol: false,
      notes: 'Category-specific rules are maintained in docs/security and must be reviewed with local counsel before launch.',
    },
  },
  BB: {
    code: 'BB',
    displayName: 'Barbados',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    supportedCurrencies: ['BBD', 'USD', 'GNOT'],
    defaultCurrency: 'BBD',
    telephonePrefix: '+1-246',
    timeZone: 'America/Barbados',
    regions: [
      {
        id: 'bb-bridgetown',
        names: t('Bridgetown', 'Bridgetown'),
        cities: [
          { id: 'bb-bridgetown-city', names: t('Bridgetown', 'Bridgetown'), approxLatitude: 13.0975, approxLongitude: -59.6165 },
          { id: 'bb-saint-michael', names: t('Saint Michael', 'Saint Michael'), approxLatitude: 13.1, approxLongitude: -59.62 },
        ],
      },

      {
        id: 'bb-saint-james',
        names: t('Saint James', 'Saint James'),
        cities: [
          { id: 'bb-holetown', names: t('Holetown', 'Holetown'), approxLatitude: 13.1892, approxLongitude: -59.6388 },
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
      enabled: true,
      comingSoon: false,
      wallets: ['adena'],
      note: t(
        'Connect your Adena wallet to pay with GNOT on the onyx testnet. Real mainnet settlement arrives after launch review.',
        'Conecta tu billetera Adena para pagar con GNOT en la red de prueba onyx. El settlements en mainnet llega después del lanzamiento.',
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
      prohibitedItemKeys: ['weapons', 'controlledSubstances', 'counterfeit', 'human_trafficking', 'stolenGoods'],
      allowUsedGoods: true,
      allowTobaccoAndAlcohol: false,
      notes: 'Category-specific rules are maintained in docs/security and must be reviewed with local counsel before launch.',
    },
  },
  GY: {
    code: 'GY',
    displayName: 'Guyana',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    supportedCurrencies: ['GYD', 'USD', 'GNOT'],
    defaultCurrency: 'GYD',
    telephonePrefix: '+592',
    timeZone: 'America/Guyana',
    regions: [
      {
        id: 'gy-demerara',
        names: t('Demerara', 'Demerara'),
        cities: [
          { id: 'gy-georgetown', names: t('Georgetown', 'Georgetown'), approxLatitude: 6.8045, approxLongitude: -58.1558 },
        ],
      },

      {
        id: 'gy-east-berbice',
        names: t('East Berbice', 'East Berbice'),
        cities: [
          { id: 'gy-new-amsterdam', names: t('New Amsterdam', 'New Amsterdam'), approxLatitude: 6.254, approxLongitude: -57.527 },
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
      enabled: true,
      comingSoon: false,
      wallets: ['adena'],
      note: t(
        'Connect your Adena wallet to pay with GNOT on the onyx testnet. Real mainnet settlement arrives after launch review.',
        'Conecta tu billetera Adena para pagar con GNOT en la red de prueba onyx. El settlements en mainnet llega después del lanzamiento.',
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
      prohibitedItemKeys: ['weapons', 'controlledSubstances', 'counterfeit', 'human_trafficking', 'stolenGoods'],
      allowUsedGoods: true,
      allowTobaccoAndAlcohol: false,
      notes: 'Category-specific rules are maintained in docs/security and must be reviewed with local counsel before launch.',
    },
  },

  BS: caribbeanMarket({
    code: 'BS',
    displayName: 'Bahamas',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'BSD',
    telephonePrefix: '+1-242',
    timeZone: 'America/Nassau',
    regions: [
      { id: 'bs-nassau', names: t('Nassau', 'Nassau'), cities: [
        { id: 'bs-nassau-city', names: t('Nassau', 'Nassau'), approxLatitude: 25.0443, approxLongitude: -77.3504 },
        { id: 'bs-freeport', names: t('Freeport', 'Freeport'), approxLatitude: 26.5294, approxLongitude: -78.6966 },
      ] },
    ],
  }),

  DO: caribbeanMarket({
    code: 'DO',
    displayName: 'Dominican Republic',
    supportedLanguages: ['en', 'es'],
    defaultLocale: 'es',
    defaultCurrency: 'DOP',
    telephonePrefix: '+1-809',
    timeZone: 'America/Santo_Domingo',
    regions: [
      { id: 'do-distrito-nacional', names: t('Distrito Nacional', 'Distrito Nacional'), cities: [
        { id: 'do-santo-domingo', names: t('Santo Domingo', 'Santo Domingo'), approxLatitude: 18.4861, approxLongitude: -69.9312 },
      ] },
      { id: 'do-santiago', names: t('Santiago', 'Santiago'), cities: [
        { id: 'do-santiago-city', names: t('Santiago de los Caballeros', 'Santiago de los Caballeros'), approxLatitude: 19.4517, approxLongitude: -70.697 },
      ] },
    ],
  }),

  HT: caribbeanMarket({
    code: 'HT',
    displayName: 'Haiti',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'HTG',
    telephonePrefix: '+509',
    timeZone: 'America/Port-au-Prince',
    regions: [
      { id: 'ht-ouest', names: t('Ouest', 'Ouest'), cities: [
        { id: 'ht-port-au-prince', names: t('Port-au-Prince', 'Port-au-Prince'), approxLatitude: 18.5944, approxLongitude: -72.3074 },
        { id: 'ht-delmas', names: t('Delmas', 'Delmas'), approxLatitude: 18.5447, approxLongitude: -72.3028 },
      ] },
    ],
  }),

  PR: caribbeanMarket({
    code: 'PR',
    displayName: 'Puerto Rico',
    supportedLanguages: ['es', 'en'],
    defaultLocale: 'es',
    defaultCurrency: 'USD',
    telephonePrefix: '+1-787',
    timeZone: 'America/Puerto_Rico',
    regions: [
      { id: 'pr-san-juan', names: t('San Juan', 'San Juan'), cities: [
        { id: 'pr-san-juan-city', names: t('San Juan', 'San Juan'), approxLatitude: 18.4655, approxLongitude: -66.1057 },
        { id: 'pr-bayamon', names: t('Bayamón', 'Bayamón'), approxLatitude: 18.3986, approxLongitude: -66.1558 },
      ] },
    ],
  }),

  CU: caribbeanMarket({
    code: 'CU',
    displayName: 'Cuba',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'CUP',
    telephonePrefix: '+53',
    timeZone: 'America/Havana',
    regions: [
      { id: 'cu-la-habana', names: t('La Habana', 'La Habana'), cities: [
        { id: 'cu-havana', names: t('La Habana', 'La Habana'), approxLatitude: 23.1136, approxLongitude: -82.3666 },
      ] },
      { id: 'cu-santiago-cuba', names: t('Santiago de Cuba', 'Santiago de Cuba'), cities: [
        { id: 'cu-santiago-city', names: t('Santiago de Cuba', 'Santiago de Cuba'), approxLatitude: 20.0171, approxLongitude: -75.8271 },
      ] },
    ],
  }),

  BZ: caribbeanMarket({
    code: 'BZ',
    displayName: 'Belize',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'BZD',
    telephonePrefix: '+501',
    timeZone: 'America/Belize',
    regions: [
      { id: 'bz-belize-district', names: t('Belize District', 'Belize District'), cities: [
        { id: 'bz-belize-city', names: t('Belize City', 'Belize City'), approxLatitude: 17.4995, approxLongitude: -88.1884 },
      ] },
      { id: 'bz-cayo', names: t('Cayo', 'Cayo'), cities: [
        { id: 'bz-san-ignacio', names: t('San Ignacio', 'San Ignacio'), approxLatitude: 17.1561, approxLongitude: -89.0708 },
      ] },
    ],
  }),

  AG: caribbeanMarket({
    code: 'AG',
    displayName: 'Antigua and Barbuda',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-268',
    timeZone: 'America/Antigua',
    regions: [
      { id: 'ag-saint-john', names: t('Saint John', 'Saint John'), cities: [
        { id: 'ag-st-johns', names: t("St. John's", "St. John's"), approxLatitude: 17.1175, approxLongitude: -61.8456 },
      ] },
    ],
  }),

  LC: caribbeanMarket({
    code: 'LC',
    displayName: 'Saint Lucia',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-758',
    timeZone: 'America/St_Lucia',
    regions: [
      { id: 'lc-castries', names: t('Castries', 'Castries'), cities: [
        { id: 'lc-castries-city', names: t('Castries', 'Castries'), approxLatitude: 14.0101, approxLongitude: -60.9875 },
      ] },
      { id: 'lc-soufriere', names: t('Soufrière', 'Soufrière'), cities: [
        { id: 'lc-soufriere-town', names: t('Soufrière', 'Soufrière'), approxLatitude: 13.8786, approxLongitude: -61.057 },
      ] },
    ],
  }),

  GD: caribbeanMarket({
    code: 'GD',
    displayName: 'Grenada',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-473',
    timeZone: 'America/Grenada',
    regions: [
      { id: 'gd-saint-george', names: t('Saint George', 'Saint George'), cities: [
        { id: 'gd-st-georges', names: t("St. George's", "St. George's"), approxLatitude: 12.0564, approxLongitude: -61.7485 },
      ] },
    ],
  }),

  DM: caribbeanMarket({
    code: 'DM',
    displayName: 'Dominica',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-767',
    timeZone: 'America/Dominica',
    regions: [
      { id: 'dm-saint-george-dm', names: t('Saint George', 'Saint George'), cities: [
        { id: 'dm-roseau', names: t('Roseau', 'Roseau'), approxLatitude: 15.3017, approxLongitude: -61.3881 },
      ] },
    ],
  }),

  VC: caribbeanMarket({
    code: 'VC',
    displayName: 'Saint Vincent and the Grenadines',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-784',
    timeZone: 'America/St_Vincent',
    regions: [
      { id: 'vc-charlotte', names: t('Charlotte', 'Charlotte'), cities: [
        { id: 'vc-kingstown', names: t('Kingstown', 'Kingstown'), approxLatitude: 13.1554, approxLongitude: -61.2275 },
      ] },
    ],
  }),

  KN: caribbeanMarket({
    code: 'KN',
    displayName: 'Saint Kitts and Nevis',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-869',
    timeZone: 'America/St_Kitts',
    regions: [
      { id: 'kn-saint-george-basseterre', names: t('Saint George Basseterre', 'Saint George Basseterre'), cities: [
        { id: 'kn-basseterre', names: t('Basseterre', 'Basseterre'), approxLatitude: 17.3026, approxLongitude: -62.7177 },
      ] },
    ],
  }),

  SR: caribbeanMarket({
    code: 'SR',
    displayName: 'Suriname',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'SRD',
    telephonePrefix: '+597',
    timeZone: 'America/Paramaribo',
    regions: [
      { id: 'sr-paramaribo', names: t('Paramaribo', 'Paramaribo'), cities: [
        { id: 'sr-paramaribo-city', names: t('Paramaribo', 'Paramaribo'), approxLatitude: 5.852, approxLongitude: -55.2038 },
      ] },
    ],
  }),

  AW: caribbeanMarket({
    code: 'AW',
    displayName: 'Aruba',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'AWG',
    telephonePrefix: '+297',
    timeZone: 'America/Aruba',
    regions: [
      { id: 'aw-aruba', names: t('Aruba', 'Aruba'), cities: [
        { id: 'aw-oranjestad', names: t('Oranjestad', 'Oranjestad'), approxLatitude: 12.5094, approxLongitude: -70.0088 },
      ] },
    ],
  }),

  CW: caribbeanMarket({
    code: 'CW',
    displayName: 'Curaçao',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'ANG',
    telephonePrefix: '+599',
    timeZone: 'America/Curacao',
    regions: [
      { id: 'cw-curacao', names: t('Curaçao', 'Curaçao'), cities: [
        { id: 'cw-willemstad', names: t('Willemstad', 'Willemstad'), approxLatitude: 12.1224, approxLongitude: -68.9371 },
      ] },
    ],
  }),

  VI: caribbeanMarket({
    code: 'VI',
    displayName: 'U.S. Virgin Islands',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'USD',
    telephonePrefix: '+1-340',
    timeZone: 'America/St_Thomas',
    regions: [
      { id: 'vi-saint-thomas', names: t('Saint Thomas', 'Saint Thomas'), cities: [
        { id: 'vi-charlotte-amalie', names: t('Charlotte Amalie', 'Charlotte Amalie'), approxLatitude: 18.3358, approxLongitude: -64.9307 },
      ] },
    ],
  }),

  VG: caribbeanMarket({
    code: 'VG',
    displayName: 'British Virgin Islands',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'USD',
    telephonePrefix: '+1-284',
    timeZone: 'America/Tortola',
    regions: [
      { id: 'vg-tortola', names: t('Tortola', 'Tortola'), cities: [
        { id: 'vg-road-town', names: t('Road Town', 'Road Town'), approxLatitude: 18.4248, approxLongitude: -64.6225 },
      ] },
    ],
  }),



  KY: caribbeanMarket({
    code: 'KY',
    displayName: 'Cayman Islands',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'KYD',
    telephonePrefix: '+1-345',
    timeZone: 'America/Cayman',
    regions: [
      { id: 'ky-grand-cayman', names: t('Grand Cayman', 'Grand Cayman'), cities: [
        { id: 'ky-george-town', names: t('George Town', 'George Town'), approxLatitude: 19.2869, approxLongitude: -81.3674 },
      ] },
    ],
  }),
  TC: caribbeanMarket({
    code: 'TC',
    displayName: 'Turks and Caicos Islands',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'USD',
    telephonePrefix: '+1-649',
    timeZone: 'America/Grand_Turk',
    regions: [
      { id: 'tc-providenciales', names: t('Providenciales', 'Providenciales'), cities: [
        { id: 'tc-leeward', names: t('Leeward Settlement', 'Leeward Settlement'), approxLatitude: 21.7736, approxLongitude: -72.2684 },
      ] },
    ],
  }),
  MS: caribbeanMarket({
    code: 'MS',
    displayName: 'Montserrat',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-664',
    timeZone: 'America/Montserrat',
    regions: [
      { id: 'ms-saint-peters', names: t('Saint Peters', 'Saint Peters'), cities: [
        { id: 'ms-brades', names: t('Brades', 'Brades'), approxLatitude: 16.7425, approxLongitude: -62.1874 },
      ] },
    ],
  }),
  AI: caribbeanMarket({
    code: 'AI',
    displayName: 'Anguilla',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'XCD',
    telephonePrefix: '+1-264',
    timeZone: 'America/Anguilla',
    regions: [
      { id: 'ai-the-valley', names: t('The Valley', 'The Valley'), cities: [
        { id: 'ai-valley-town', names: t('The Valley', 'The Valley'), approxLatitude: 18.2148, approxLongitude: -63.0572 },
      ] },
    ],
  }),
  SX: caribbeanMarket({
    code: 'SX',
    displayName: 'Sint Maarten',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'ANG',
    telephonePrefix: '+1-721',
    timeZone: 'America/Lower_Princes',
    regions: [
      { id: 'sx-philipsburg', names: t('Philipsburg', 'Philipsburg'), cities: [
        { id: 'sx-philipsburg-city', names: t('Philipsburg', 'Philipsburg'), approxLatitude: 18.0296, approxLongitude: -63.0504 },
      ] },
    ],
  }),
  MQ: caribbeanMarket({
    code: 'MQ',
    displayName: 'Martinique',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'EUR',
    telephonePrefix: '+596',
    timeZone: 'America/Martinique',
    regions: [
      { id: 'mq-fort-de-france', names: t('Fort-de-France', 'Fort-de-France'), cities: [
        { id: 'mq-fort-de-france-city', names: t('Fort-de-France', 'Fort-de-France'), approxLatitude: 14.6161, approxLongitude: -61.0588 },
      ] },
    ],
  }),
  GP: caribbeanMarket({
    code: 'GP',
    displayName: 'Guadeloupe',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'EUR',
    telephonePrefix: '+590',
    timeZone: 'America/Guadeloupe',
    regions: [
      { id: 'gp-basse-terre', names: t('Basse-Terre', 'Basse-Terre'), cities: [
        { id: 'gp-pointe-a-pitre', names: t('Pointe-à-Pitre', 'Pointe-à-Pitre'), approxLatitude: 16.265, approxLongitude: -61.551 },
      ] },
    ],
  }),
  GF: caribbeanMarket({
    code: 'GF',
    displayName: 'French Guiana',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'EUR',
    telephonePrefix: '+594',
    timeZone: 'America/Cayenne',
    regions: [
      { id: 'gf-cayenne', names: t('Cayenne', 'Cayenne'), cities: [
        { id: 'gf-cayenne-city', names: t('Cayenne', 'Cayenne'), approxLatitude: 4.9372, approxLongitude: -52.326 },
      ] },
    ],
  }),
  BQ: caribbeanMarket({
    code: 'BQ',
    displayName: 'Bonaire',
    supportedLanguages: ['en'],
    defaultLocale: 'en',
    defaultCurrency: 'USD',
    telephonePrefix: '+599',
    timeZone: 'America/Kralendijk',
    regions: [
      { id: 'bq-kralendijk', names: t('Kralendijk', 'Kralendijk'), cities: [
        { id: 'bq-kralendijk-city', names: t('Kralendijk', 'Kralendijk'), approxLatitude: 12.1443, approxLongitude: -68.2657 },
      ] },
    ],
  }),
};

/** Compact builder for Caribbean markets sharing the platform policy blocks. */
function caribbeanMarket(input: {
  code: CountryCode;
  displayName: string;
  supportedLanguages: Locale[];
  defaultLocale: Locale;
  defaultCurrency: CurrencyCode;
  telephonePrefix: string;
  timeZone: string;
  regions: RegionConfig[];
}): CountryConfig {
  return {
    code: input.code,
    displayName: input.displayName,
    supportedLanguages: input.supportedLanguages,
    defaultLocale: input.defaultLocale,
    supportedCurrencies: [input.defaultCurrency, 'USD', 'GNOT'],
    defaultCurrency: input.defaultCurrency,
    telephonePrefix: input.telephonePrefix,
    timeZone: input.timeZone,
    regions: input.regions,
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
      enabled: true,
      comingSoon: false,
      wallets: ['adena'],
      note: t(
        'Connect your Adena wallet to pay with GNOT on the onyx testnet.',
        'Conecta tu billetera Adena para pagar con GNOT en la red de prueba onyx.',
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
      prohibitedItemKeys: ['weapons', 'controlledSubstances', 'counterfeit', 'human_trafficking', 'stolenGoods'],
      allowUsedGoods: true,
      allowTobaccoAndAlcohol: false,
      notes: 'Category-specific rules are maintained in docs/security and must be reviewed with local counsel before launch.',
    },
  };
}
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
