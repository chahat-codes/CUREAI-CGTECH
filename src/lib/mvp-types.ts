export type UserRole = "patient" | "doctor" | "receptionist" | "admin";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Doctor = {
  id: string;
  user_id?: string | null;
  name: string;
  specialization: string;
  clinic_name: string;
  location: string;
  consultation_fee: number;
  available_time: string;
  rating: number;
  wait_time: number;
  qualification?: string | null;
  experience?: number | null;
  clinic_address?: string | null;
  city?: string | null;
  phone?: string | null;
  profile_image_url?: string | null;
  credits?: number;
  is_verified?: boolean;
  is_active?: boolean;
  available_days?: string[];
  available_slots?: string[];
};

export type AppointmentStatus = "booked" | "completed" | "cancelled";
export type QueueStatus = "waiting" | "arrived" | "current" | "completed" | "skipped" | "cancelled";

export type Appointment = {
  id: string;
  patient_id: string;
  doctor_id: string;
  symptoms: string;
  specialist_suggested: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  token_number: number;
};

export type QueueToken = {
  id: string;
  doctor_id: string;
  appointment_id: string;
  token_number: number;
  current_status: QueueStatus;
  created_at: string;
};

export type AppointmentWithDetails = Appointment & {
  doctor: Doctor;
  queue_token?: QueueToken;
};

export type MvpFlow = {
  symptoms: string;
  specialist: string;
  doctor?: Doctor;
};

export type Patient = {
  id: string;
  user_id?: string | null;
  medical_id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  phone: string;
};

export type PatientRecord = {
  id: string;
  patient_id: string;
  appointment_id?: string | null;
  file_url: string;
  file_name: string;
  record_type: string;
  created_at?: string;
};

export type DoctorNote = {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string | null;
  notes: string;
  diagnosis: string;
  prescription: string;
  follow_up_date?: string | null;
  created_at?: string;
};
