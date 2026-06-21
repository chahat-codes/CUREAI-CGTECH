# Cure AI Website

Cure AI is a Next.js App Router website built with React, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

## Project Type

- Framework: Next.js 16
- Router: App Router in `src/app`
- Styling: Tailwind CSS 4 via `src/app/globals.css`
- Main pages:
  - `/`
  - `/features`
  - `/for-patients`
  - `/for-clinics`
  - `/symptoms`
  - `/find-doctor`
  - `/booking`
  - `/patient-dashboard`
  - `/doctor-dashboard`
  - `/receptionist-dashboard`
  - `/admin`
  - `/admin/doctors`
  - `/admin/doctors/new`
  - `/admin/doctors/[id]/edit`
  - `/login`

## Setup

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is busy, Next.js will offer or use another available port.

## Supabase Setup

Create `.env.local` from `.env.example` and add your Supabase project keys:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

This app also supports the Next.js-style aliases:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

In Supabase SQL Editor, run:

```text
supabase/schema.sql
supabase/seed.sql
```

### MVP Login

Cure AI currently uses a simple MVP login on `/login`.

Users enter:

- name
- phone number or email
- role

The app creates or updates the profile in the Supabase `users` table when Supabase is configured, then stores the user locally for the MVP session. OTP and magic-link verification are disabled for now.

The Supabase Auth OTP helper code is still kept in `src/lib/auth.ts` for a later production login flow. If you re-enable OTP later, configure the Supabase Magic Link email template with `supabase/email-otp-template.html` so it sends `{{ .Token }}` instead of a magic link.

The app has a local demo fallback, so the MVP flow can be tested before Supabase is connected.

## MVP Flow

1. Visit `/symptoms` and enter symptoms.
2. Cure AI suggests a specialist with simple keyword matching.
3. `/find-doctor` shows matching doctors.
4. `/booking` creates an appointment and digital token.
5. `/patient-dashboard` shows token and queue status.
6. `/doctor-dashboard` lets a doctor call the next patient.
7. `/receptionist-dashboard` lets front desk staff manage arrivals, skips, cancellations, and completion.

The symptom matcher lives in `src/lib/symptoms.ts`. Replace that function with a real AI API later without changing the rest of the flow.

## Staff Dashboards

The doctor dashboard includes overview cards, today appointments, Medical ID search, patient BMI/profile details, uploaded records, appointment history, doctor notes, follow-up date, and an AI summary placeholder.

The receptionist dashboard updates `queue_tokens.current_status` with:

- `waiting`
- `arrived`
- `current`
- `completed`
- `skipped`
- `cancelled`

Run the latest `supabase/schema.sql` again after pulling these changes so the `receptionist` role, patient tables, record tables, notes tables, and updated queue status constraint exist in Supabase.

## Admin Doctor Management

Admin routes let an admin add doctors, edit listings, activate/deactivate doctors, assign onboarding credits, and update clinic, fee, specialization, available days, and slots. Public doctor search only shows doctors where `is_active = true`.

## Checks

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production build locally after building:

```bash
npm run start
```

## Notes

The app uses system font fallbacks in CSS instead of build-time Google font fetching, so `npm run build` works in offline or restricted-network environments.
