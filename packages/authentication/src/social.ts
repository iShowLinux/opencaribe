export type SocialProviderId = 'google' | 'twitter';

export interface SocialProvider {
  id: SocialProviderId;
  label: string;
}

export interface ResolvedSocialProviders {
  google?: { clientId: string; clientSecret: string };
  twitter?: { clientId: string; clientSecret: string };
}

type ProviderEnv = Record<string, string | undefined>;

const PROVIDERS: Record<SocialProviderId, { label: string; clientIdEnv: string; clientSecretEnv: string }> = {
  google: { label: 'Google', clientIdEnv: 'GOOGLE_CLIENT_ID', clientSecretEnv: 'GOOGLE_CLIENT_SECRET' },
  twitter: { label: 'X', clientIdEnv: 'TWITTER_CLIENT_ID', clientSecretEnv: 'TWITTER_CLIENT_SECRET' },
};

/** A provider is only advertised when both credentials are present. */
export function enabledSocialProviders(env: ProviderEnv = process.env): SocialProvider[] {
  return (Object.keys(PROVIDERS) as SocialProviderId[])
    .filter((id) => Boolean(env[PROVIDERS[id].clientIdEnv] && env[PROVIDERS[id].clientSecretEnv]))
    .map((id) => ({ id, label: PROVIDERS[id].label }));
}

export function resolveSocialProviders(env: ProviderEnv = process.env): ResolvedSocialProviders {
  const resolved: ResolvedSocialProviders = {};
  for (const id of Object.keys(PROVIDERS) as SocialProviderId[]) {
    const config = PROVIDERS[id];
    const clientId = env[config.clientIdEnv];
    const clientSecret = env[config.clientSecretEnv];
    if (!clientId || !clientSecret) continue;
    if (id === 'google') resolved.google = { clientId, clientSecret };
    else resolved.twitter = { clientId, clientSecret };
  }
  return resolved;
}
