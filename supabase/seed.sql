insert into public.doctors
  (name, specialization, clinic_name, location, consultation_fee, available_time, rating, wait_time)
values
  ('Dr. Meera Kapoor', 'Dermatologist', 'CureSkin Clinic', 'Bandra, Mumbai', 700, '10:00 AM - 2:00 PM', 4.8, 12),
  ('Dr. Arjun Nair', 'Dermatologist', 'DermaPlus Center', 'Indiranagar, Bengaluru', 650, '4:00 PM - 8:00 PM', 4.6, 18),
  ('Dr. Priya Shah', 'Dentist', 'SmileCare Dental', 'Andheri, Mumbai', 500, '11:00 AM - 6:00 PM', 4.7, 10),
  ('Dr. Rahul Sharma', 'General Physician', 'Cure AI Partner Clinic', 'Koramangala, Bengaluru', 499, '9:00 AM - 5:00 PM', 4.9, 8),
  ('Dr. Nisha Verma', 'General Physician', 'HealthFirst Clinic', 'Powai, Mumbai', 450, '12:00 PM - 7:00 PM', 4.5, 16),
  ('Dr. Vikram Rao', 'Cardiologist', 'HeartLine Hospital', 'Jayanagar, Bengaluru', 1200, '10:30 AM - 3:30 PM', 4.9, 20),
  ('Dr. Ananya Iyer', 'Gynecologist', 'WomenCare Clinic', 'T. Nagar, Chennai', 900, '2:00 PM - 7:00 PM', 4.8, 15),
  ('Dr. Farhan Ali', 'Ophthalmologist', 'ClearView Eye Center', 'Gachibowli, Hyderabad', 800, '9:30 AM - 1:30 PM', 4.7, 11),
  ('Dr. Kavita Menon', 'Cardiologist', 'PulseCare Clinic', 'Bandra, Mumbai', 1100, '5:00 PM - 9:00 PM', 4.6, 25),
  ('Dr. Rohan Gupta', 'Dentist', 'Urban Dental Studio', 'Saket, Delhi', 550, '10:00 AM - 4:00 PM', 4.4, 14);

insert into public.patients
  (medical_id, name, age, gender, height, weight, bmi, phone)
values
  ('CURE-DEMO-001', 'Sarah Jenkins', 32, 'Female', 165, 62, 22.8, '+91 90000 00000'),
  ('CURE-DEMO-002', 'Aarav Mehta', 41, 'Male', 174, 79, 26.1, '+91 90000 00001')
on conflict (medical_id) do nothing;

insert into public.patient_records
  (patient_id, file_url, file_name, record_type)
select id, 'https://example.com/demo-cbc.pdf', 'CBC Report.pdf', 'Lab Report'
from public.patients
where medical_id = 'CURE-DEMO-001'
on conflict do nothing;

update public.doctors
set
  credits = coalesce(nullif(credits, 0), 500),
  is_active = true,
  is_verified = true,
  available_days = case
    when cardinality(available_days) = 0 then array['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    else available_days
  end,
  available_slots = case
    when cardinality(available_slots) = 0 then array['10:00', '11:00', '12:00', '16:00']
    else available_slots
  end,
  city = case when city = '' then split_part(location, ',', 2) else city end;
