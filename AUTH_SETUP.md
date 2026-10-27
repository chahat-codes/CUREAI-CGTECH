# Cure AI patient sign-in setup

The navbar links to `/login`, which serves the Cure AI patient sign-in and account creation screen. Authentication uses Supabase Auth with email/password, Google OAuth, email confirmation, and password reset. Mobile-number login performs a server-side profile lookup and needs the server-only service role key.

## Supabase configuration

1. Apply `supabase/migrations/20261027090000_patient_auth_and_cure_id.sql` to the Supabase database configured for this site. It creates a patient profile at auth signup, assigns a unique `CURE-XXXX-XXXX` ID, and enables row-level security so a patient can read only their own profile.
2. In Supabase Auth, enable email/password and email confirmation. Add `http://localhost:3000/auth/callback` and the deployed callback URL to allowed redirect URLs.
3. To use Google, configure Google OAuth under Supabase Auth > Providers > Google, and enter the Supabase callback URL in the Google OAuth client settings.
4. For phone-number login, add `SUPABASE_SERVICE_ROLE_KEY` to the server environment only. Never prefix it with `NEXT_PUBLIC_` or expose it in browser code. Email login works without this server-only key.

The existing `.env.local` file is not modified by this change. See `.env.example` for variable names.
