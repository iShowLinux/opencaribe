import { describe, expect, it } from 'vitest';
import { enabledSocialProviders, resolveSocialProviders } from './index';

describe('social SSO configuration', () => {
  it('advertises nothing without credentials', () => {
    expect(enabledSocialProviders({})).toEqual([]);
    expect(resolveSocialProviders({})).toEqual({});
  });

  it('requires both client id and secret', () => {
    expect(enabledSocialProviders({ GOOGLE_CLIENT_ID: 'id' })).toEqual([]);
    expect(enabledSocialProviders({ TWITTER_CLIENT_SECRET: 'secret' })).toEqual([]);
  });

  it('enables providers that are fully configured', () => {
    const env = {
      GOOGLE_CLIENT_ID: 'g-id',
      GOOGLE_CLIENT_SECRET: 'g-secret',
      TWITTER_CLIENT_ID: 'x-id',
      TWITTER_CLIENT_SECRET: 'x-secret',
    };
    expect(enabledSocialProviders(env)).toEqual([
      { id: 'google', label: 'Google' },
      { id: 'twitter', label: 'X' },
    ]);
    expect(resolveSocialProviders(env)).toEqual({
      google: { clientId: 'g-id', clientSecret: 'g-secret' },
      twitter: { clientId: 'x-id', clientSecret: 'x-secret' },
    });
  });
});
