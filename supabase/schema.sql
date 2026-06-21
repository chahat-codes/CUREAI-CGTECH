create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  role text not null
);

alter table public.users drop constraint if exists users_role_check;
alter table public.users
  add constraint users_role_check check (role in ('patient', 'doctor', 'receptionist', 'admin'));

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  name text not null,
  specialization text not null,
  clinic_name text not null,
  location text not null,
  consultation_fee integer not null,
  available_time text not null,
  rating numeric(2, 1) not null default 4.5,
  wait_time integer not null default 10
);

alter table public.doctors
  add column if not exists user_id uuid references public.users(id) on delete set null;
alter table public.doctors
  add column if not exists qualification text not null default '';
alter table public.doctors
  add column if not exists experience integer not null default 0;
alter table public.doctors
  add column if not exists clinic_address text not null default '';
alter table public.doctors
  add column if not exists city text not null default '';
alter table public.doctors
  add column if not exists phone text not null default '';
alter table public.doctors
  add column if not exists profile_image_url text not null default '';
alter table public.doctors
  add column if not exists credits integer not null default 0;
alter table public.doctors
  add column if not exists is_verified boolean not null default false;
alter table public.doctors
  add column if not exists is_active boolean not null default true;
alter table public.doctors
  add column if not exists available_days text[] not null default array[]::text[];
alter table public.doctors
  add column if not exists available_slots text[] not null default array[]::text[];
alter table public.doctors
  add column if not exists created_at timestamptz not null default now();

update public.doctors set is_active = true where is_active is null;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.users(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  symptoms text not null,
  specialist_suggested text not null,
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'booked' check (status in ('booked', 'completed', 'cancelled')),
  token_number integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.queue_tokens (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  token_number integer not null,
  current_status text not null default 'waiting',
  created_at timestamptz not null default now()
);

alter table public.queue_tokens drop constraint if exists queue_tokens_current_status_check;
alter table public.queue_tokens
  add constraint queue_tokens_current_status_check
  check (current_status in ('waiting', 'arrived', 'current', 'completed', 'skipped', 'cancelled'));

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  medical_id text not null unique,
  name text not null,
  age integer not null,
  gender text not null,
  height numeric(5, 2) not null,
  weight numeric(5, 2) not null,
  bmi numeric(4, 1) not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.patient_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  file_url text not null,
  file_name text not null,
  record_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.doctor_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  notes text not null default '',
  diagnosis text not null default '',
  prescription text not null default '',
  follow_up_date date,
  created_at timestamptz not null default now()
);

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

create index if not exists doctors_specialization_idx on public.doctors (specialization);
create index if not exists appointments_patient_idx on public.appointments (patient_id);
create index if not exists appointments_doctor_date_idx on public.appointments (doctor_id, appointment_date);
create index if not exists queue_tokens_doctor_status_idx on public.queue_tokens (doctor_id, current_status);
create index if not exists patients_medical_id_idx on public.patients (medical_id);
create index if not exists patient_records_patient_idx on public.patient_records (patient_id);
create index if not exists doctor_notes_patient_idx on public.doctor_notes (patient_id);
create index if not exists doctor_notes_doctor_followup_idx on public.doctor_notes (doctor_id, follow_up_date);
create unique index if not exists waitlist_email_unique_idx on public.waitlist (lower(email));
create unique index if not exists waitlist_phone_unique_idx on public.waitlist (phone);

grant insert on public.waitlist to anon, authenticated;
grant select on public.waitlist to authenticated;

alter table public.users enable row level security;
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.queue_tokens enable row level security;
alter table public.patients enable row level security;
alter table public.patient_records enable row level security;
alter table public.doctor_notes enable row level security;
alter table public.waitlist enable row level security;

drop policy if exists "Anyone can read doctors" on public.doctors;
drop policy if exists "Anyone can read active doctors" on public.doctors;
drop policy if exists "Staff can read all doctors" on public.doctors;
drop policy if exists "Admins can insert doctors" on public.doctors;
drop policy if exists "Admins can update doctors" on public.doctors;
drop policy if exists "Users can read their own profile" on public.users;
drop policy if exists "Users can create their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "Patients can create their appointments" on public.appointments;
drop policy if exists "Patients can read their appointments" on public.appointments;
drop policy if exists "Doctors can read assigned appointments" on public.appointments;
drop policy if exists "Staff can read appointments" on public.appointments;
drop policy if exists "Staff can update appointments" on public.appointments;
drop policy if exists "Patients can create queue tokens for their appointments" on public.queue_tokens;
drop policy if exists "Patients can read queue tokens for their appointments" on public.queue_tokens;
drop policy if exists "Authenticated users can read visible queue tokens" on public.queue_tokens;
drop policy if exists "Doctors can read their queue" on public.queue_tokens;
drop policy if exists "Doctors can update their queue" on public.queue_tokens;
drop policy if exists "Staff can read queue tokens" on public.queue_tokens;
drop policy if exists "Staff can update queue tokens" on public.queue_tokens;
drop policy if exists "Staff can read patients" on public.patients;
drop policy if exists "Patients can read own patient profile" on public.patients;
drop policy if exists "Staff can read patient records" on public.patient_records;
drop policy if exists "Patients can read own records" on public.patient_records;
drop policy if exists "Staff can read doctor notes" on public.doctor_notes;
drop policy if exists "Doctors can create notes" on public.doctor_notes;
drop policy if exists "Anyone can join waitlist" on public.waitlist;
drop policy if exists "Admins can read waitlist" on public.waitlist;

create policy "Anyone can read active doctors"
  on public.doctors for select
  using (is_active = true);

create policy "Staff can read all doctors"
  on public.doctors for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Admins can insert doctors"
  on public.doctors for insert
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role = 'admin'
    )
  );

create policy "Admins can update doctors"
  on public.doctors for update
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role = 'admin'
    )
  );

create policy "Users can read their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can create their own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Patients can create their appointments"
  on public.appointments for insert
  with check (auth.uid() = patient_id);

create policy "Patients can read their appointments"
  on public.appointments for select
  using (auth.uid() = patient_id);

create policy "Doctors can read assigned appointments"
  on public.appointments for select
  using (auth.uid() = doctor_id);

create policy "Staff can read appointments"
  on public.appointments for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Staff can update appointments"
  on public.appointments for update
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Patients can create queue tokens for their appointments"
  on public.queue_tokens for insert
  with check (
    exists (
      select 1
      from public.appointments
      where appointments.id = queue_tokens.appointment_id
        and appointments.patient_id = auth.uid()
    )
  );

create policy "Patients can read queue tokens for their appointments"
  on public.queue_tokens for select
  using (
    exists (
      select 1
      from public.appointments
      where appointments.id = queue_tokens.appointment_id
        and appointments.patient_id = auth.uid()
    )
  );

create policy "Authenticated users can read visible queue tokens"
  on public.queue_tokens for select
  using (auth.role() = 'authenticated');

create policy "Doctors can read their queue"
  on public.queue_tokens for select
  using (auth.uid() = doctor_id);

create policy "Doctors can update their queue"
  on public.queue_tokens for update
  using (auth.uid() = doctor_id);

create policy "Staff can read queue tokens"
  on public.queue_tokens for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Staff can update queue tokens"
  on public.queue_tokens for update
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Staff can read patients"
  on public.patients for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Patients can read own patient profile"
  on public.patients for select
  using (user_id = auth.uid());

create policy "Staff can read patient records"
  on public.patient_records for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Patients can read own records"
  on public.patient_records for select
  using (
    exists (
      select 1 from public.patients
      where patients.id = patient_records.patient_id
        and patients.user_id = auth.uid()
    )
  );

create policy "Staff can read doctor notes"
  on public.doctor_notes for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'receptionist', 'admin')
    )
  );

create policy "Doctors can create notes"
  on public.doctor_notes for insert
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.role in ('doctor', 'admin')
    )
  );

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
