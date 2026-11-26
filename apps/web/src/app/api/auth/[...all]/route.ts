import { createAuth, enabledSocialProviders } from '@opencaribe/authentication';

async function handler(request: Request) {
  const url = new URL(request.url);
  const providerMatch = url.pathname.match(/\/api\/auth\/sign-in\/([a-z]+)$/);
  if (providerMatch?.[1] && request.method === 'GET') {
    const providerId = providerMatch[1];
    const enabled = enabledSocialProviders().some((provider) => provider.id === providerId);
    if (!enabled) {
      // Unconfigured social provider: send the user back to the sign-in page.
      return Response.redirect(new URL('/login?error=provider_disabled', url), 302);
    }
  }
  return createAuth().handler(request);
}

export { handler as GET, handler as POST };
