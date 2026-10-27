# Cure AI V2 authentication setup

Authentication is implemented in this V2 project using Supabase Auth. No credentials or database configuration are committed.

## Configure Supabase

1. Create or select the Supabase project intended for Cure AI V2.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service role key in browser code or commit `.env.local`.
3. Apply `supabase/migrations/20261027090000_patient_auth_and_cure_id.sql` to the V2 database (for example through the Supabase SQL editor or Supabase CLI).
4. In Supabase Auth, enable email/password sign-in and email confirmation. Add the local callback `http://localhost:3000/auth/callback` and the production callback URL to the allowed redirect URLs.
5. For Google sign-in, configure the Google OAuth client in Supabase Auth > Providers > Google and set the matching OAuth callback URL in Google Cloud. Without these credentials, the UI reports that provider configuration is required.
6. Restart the V2 dev server after changing environment variables.

The database trigger assigns every new auth user a unique `CURE-XXXX-XXXX` identifier and creates their patient profile. Row-level security restricts profile reads/updates to that patient's authenticated user ID. Mobile-number login requires the server-only service role key for the profile lookup; email login does not.

## Routes

- `/login` — email or mobile login, Google OAuth, password reset
- `/register` — patient account registration and consent
- `/auth/callback` — PKCE/OAuth and email confirmation callback
- `/reset-password` — secure password reset completion
- `/dashboard` — signed-in profile and Cure ID
- `/booking`, `/vault` — patient-only views

Appointment booking and the health-record vault are still preview experiences and do not persist appointments or uploaded records to the database yet. No sample patient records are shown as if they belonged to a signed-in user.
