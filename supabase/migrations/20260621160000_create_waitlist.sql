create extension if not exists "pgcrypto";

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  user_type text not null,
  city text not null,
  created_at timestamptz not null default now()
);

alter table public.waitlist drop constraint if exists waitlist_user_type_check;
alter table public.waitlist
  add constraint waitlist_user_type_check
  check (user_type in ('patient', 'doctor', 'clinic', 'hospital'));

create unique index if not exists waitlist_email_unique_idx
  on public.waitlist (lower(email));

create unique index if not exists waitlist_phone_unique_idx
  on public.waitlist (phone);

grant insert on public.waitlist to anon, authenticated;
grant select on public.waitlist to authenticated;

alter table public.waitlist enable row level security;

drop policy if exists "Anyone can join waitlist" on public.waitlist;
drop policy if exists "Admins can read waitlist" on public.waitlist;

create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

create policy "Admins can read waitlist"
  on public.waitlist for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role = 'admin'
    )
  );
