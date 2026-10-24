# LocalBite auth callback

This small Next.js site receives the HTTPS redirect after Supabase confirms a
signup email. It reads the confirmation result from the browser URL fragment,
removes that fragment so tokens are not left in the address bar, and tells the
user to return to LocalBite and sign in. It does not need Supabase credentials.

## Deploy to Vercel

1. Import this repository as a **new Vercel project**.
2. Set **Root Directory** to `AuthCallback`.
3. Let Vercel detect Next.js and use the default build settings, then deploy.
4. Copy the deployed HTTPS origin, for example
   `https://localbite-auth-callback.vercel.app`.

## Configure Supabase and the Expo app

1. In Supabase **Authentication → URL Configuration**, keep the current **Site
   URL** and add this exact URL to **Redirect URLs**:
   `https://<deployed-origin>/auth/callback`
2. In `Frontend/.env`, set
   `EXPO_PUBLIC_AUTH_REDIRECT_URL=https://<deployed-origin>/auth/callback`.
3. Restart Expo (or rebuild the app if testing a native build), then request a
   new confirmation email. Existing emails retain their original redirect.
4. Ensure the Supabase confirmation email template uses
   `{{ .ConfirmationURL }}`.

After confirmation, the user returns to the LocalBite app and signs in there.
