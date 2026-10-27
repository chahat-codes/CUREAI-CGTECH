create extension if not exists pgcrypto;

create sequence if not exists public.cure_id_sequence as bigint start with 1 increment by 1 no cycle;

create or replace function public.next_cure_id()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  id_number bigint;
  id_hex text;
begin
  id_number := nextval('public.cure_id_sequence');
  id_hex := lpad(to_hex(id_number >> 16), 4, '0') || lpad(to_hex(id_number & 65535), 4, '0');
  return 'CURE-' || upper(substr(id_hex, 1, 4)) || '-' || upper(substr(id_hex, 5, 4));
end;
$$;

create table if not exists public.patient_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cure_id text not null unique,
  full_name text not null,
  email text,
  mobile_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint patient_profiles_cure_id_format check (cure_id ~ '^CURE-[A-F0-9]{4}-[A-F0-9]{4}$')
);

create unique index if not exists patient_profiles_email_unique_idx
  on public.patient_profiles (lower(email)) where email is not null;
create unique index if not exists patient_profiles_mobile_unique_idx
  on public.patient_profiles (mobile_number) where mobile_number is not null;

create or replace function public.create_patient_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata_name text;
  metadata_mobile text;
begin
  metadata_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Cure AI patient'
  );
  metadata_mobile := nullif(trim(new.raw_user_meta_data ->> 'mobile_number'), '');

  insert into public.patient_profiles (user_id, cure_id, full_name, email, mobile_number)
  values (
    new.id,
    public.next_cure_id(),
    metadata_name,
    nullif(lower(trim(coalesce(new.email, new.raw_user_meta_data ->> 'email', ''))), ''),
    metadata_mobile
  )
  on conflict (user_id) do update
    set full_name = excluded.full_name,
        email = coalesce(excluded.email, public.patient_profiles.email),
        mobile_number = coalesce(excluded.mobile_number, public.patient_profiles.mobile_number),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_patient_profile on auth.users;
create trigger on_auth_user_created_patient_profile
after insert on auth.users
for each row execute function public.create_patient_profile_for_auth_user();

alter table public.patient_profiles enable row level security;
revoke all on public.patient_profiles from anon, authenticated;
grant select on public.patient_profiles to authenticated;
grant update (full_name, mobile_number, updated_at) on public.patient_profiles to authenticated;

drop policy if exists "Patients can read their own profile" on public.patient_profiles;
create policy "Patients can read their own profile"
  on public.patient_profiles for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Patients can update their own profile" on public.patient_profiles;
create policy "Patients can update their own profile"
  on public.patient_profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke all on function public.next_cure_id() from public, anon, authenticated;
revoke all on function public.create_patient_profile_for_auth_user() from public, anon, authenticated;
