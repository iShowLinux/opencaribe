# Custom domain

The app deploys at `https://opencaribe.vercel.app`. To put it on your own domain:

## 1. Add the domain in Vercel

```sh
vercel domains add www.yourdomain.com
# or a subdomain you control:
vercel domains add opencaribe.yourdomain.com
```

## 2. Point DNS at Vercel

Use either:

- **A record** for the apex: `@  76.76.21.21`
- **CNAME** for a subdomain: `www  cname.vercel-dns.com`

Vercel shows the exact records it expects on the domain's configuration page
(`vercel.com/ishowlinux/opencaribe/domains`). Wait for the certificate to issue,
then confirm with:

```sh
curl -sI https://yourdomain.com | head -n 1   # expect 200
```

## 3. Environment variables

Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the new origin so auth
callbacks and share links use it:

```sh
vercel env add BETTER_AUTH_URL production   # https://yourdomain.com
vercel env add NEXT_PUBLIC_APP_URL production
```

## 4. Notes

- Database, uploads and analytics keep working unchanged behind the new origin.
- Keep `opencaribe.vercel.app` as a working alias during propagation.
- HTTPS certificates are issued automatically by Vercel.
