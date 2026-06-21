"use client";

import { demoDoctors } from "./demo-data";
import {
  callNextLocalPatient,
  createLocalAppointment,
  getLocalDoctorQueue,
  getLocalPatientAppointments,
  getUser,
  updateLocalQueueToken,
} from "./mvp-storage";
import type {
  Appointment,
  AppointmentWithDetails,
  AppUser,
  Doctor,
  DoctorNote,
  Patient,
  PatientRecord,
  QueueStatus,
  QueueToken,
} from "./mvp-types";
import { isSupabaseConfigured, supabase } from "./supabase";

type QueueItem = {
  token: QueueToken;
  appointment: {
    id: string;
    patient_id?: string;
    symptoms: string;
    specialist_suggested: string;
    appointment_date: string;
    appointment_time: string;
    token_number: number;
    patient?: Pick<AppUser, "id" | "name" | "email"> | null;
  };
};

export type DoctorAppointment = Appointment & {
  patient?: Pick<AppUser, "id" | "name" | "email"> | null;
  queue_token?: QueueToken | null;
};

export type PatientProfileBundle = {
  patient: Patient;
  appointments: DoctorAppointment[];
  records: PatientRecord[];
  notes: DoctorNote[];
};

export type DoctorFormInput = {
  name: string;
  specialization: string;
  clinic_name: string;
  location: string;
  consultation_fee: number;
  available_time: string;
  rating: number;
  wait_time: number;
  qualification: string;
  experience: number;
  clinic_address: string;
  city: string;
  phone: string;
  profile_image_url: string;
  credits: number;
  is_verified: boolean;
  is_active: boolean;
  available_days: string[];
  available_slots: string[];
};

export function hasSupabase() {
  return isSupabaseConfigured && Boolean(supabase);
}

async function resolveCurrentUser(preferredUser: AppUser | null): Promise<AppUser | null> {
  if (!supabase) return preferredUser;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return preferredUser;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    id: data.user.id,
    name: profile?.name || preferredUser?.name || data.user.email?.split("@")[0] || "Cure AI User",
    email: profile?.email || data.user.email || preferredUser?.email || "",
    role: profile?.role || preferredUser?.role || "patient",
  };
}

export async function getDoctors(specialization?: string) {
  if (!supabase) {
    return filterDoctors(demoDoctors, specialization);
  }

  const query = supabase
    .from("doctors")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  const { data, error } = specialization
    ? await query.ilike("specialization", specialization)
    : await query;

  if (error) throw new Error(error.message);

  return filterDoctors((data || []) as Doctor[], specialization);
}

export async function getActiveDoctorId(fallbackDoctorId = "doctor-gp-1") {
  if (!supabase) return fallbackDoctorId;

  const currentUser = await resolveCurrentUser(null);
  if (currentUser?.role === "doctor") {
    const { data } = await supabase
      .from("doctors")
      .select("id")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (data?.id) return data.id as string;
  }

  const { data: firstDoctor } = await supabase
    .from("doctors")
    .select("id")
    .order("name", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (firstDoctor?.id as string | undefined) || fallbackDoctorId;
}

function filterDoctors(doctors: Doctor[], specialization?: string) {
  const activeDoctors = doctors.filter((doctor) => doctor.is_active !== false);
  if (!specialization) return activeDoctors;
  return activeDoctors.filter(
    (doctor) => doctor.specialization.toLowerCase() === specialization.toLowerCase(),
  );
}

export async function requireAdmin() {
  const user = await resolveCurrentUser(getUser());
  if (user?.role === "admin") return user;

  if (!supabase) {
    return { id: "admin-demo", name: "Demo Admin", email: "admin@demo.cureai", role: "admin" as const };
  }

  throw new Error("Admin access required.");
}

export async function getAdminDoctors(search = "", status: "all" | "active" | "inactive" = "all") {
  await requireAdmin();

  if (!supabase) {
    return demoDoctors.filter((doctor) => {
      const matchesSearch = [doctor.name, doctor.specialization, doctor.clinic_name, doctor.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ||
        (status === "active" && doctor.is_active !== false) ||
        (status === "inactive" && doctor.is_active === false);
      return matchesSearch && matchesStatus;
    });
  }

  let query = supabase
    .from("doctors")
    .select("*")
    .order("created_at", { ascending: false });

  if (status === "active") query = query.eq("is_active", true);
  if (status === "inactive") query = query.eq("is_active", false);
  if (search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},specialization.ilike.${term},clinic_name.ilike.${term},city.ilike.${term},location.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []) as Doctor[];
}

export async function getAdminDoctor(id: string) {
  await requireAdmin();
  const doctorId = id.trim();
  console.log("[Cure AI admin] Fetching doctor for edit:", doctorId);

  if (!supabase) {
    const doctor = demoDoctors.find((item) => item.id === doctorId) || null;
    console.log("[Cure AI admin] Local doctor edit response:", { doctorId, found: Boolean(doctor) });
    return doctor;
  }

  if (!doctorId) {
    console.log("[Cure AI admin] Missing doctor ID in edit URL.");
    return null;
  }

  const response = await supabase
    .from("doctors")
    .select("*")
    .eq("id", doctorId)
    .maybeSingle();

  const { data, error, status, statusText } = response;
  console.log("[Cure AI admin] Supabase doctor edit response:", {
    doctorId,
    status,
    statusText,
    data,
    error,
  });

  if (error) throw new Error(error.message);
  return data as Doctor | null;
}

export function doctorToFormInput(doctor?: Partial<Doctor> | null): DoctorFormInput {
  return {
    name: doctor?.name || "",
    specialization: doctor?.specialization || "General Physician",
    clinic_name: doctor?.clinic_name || "",
    location: doctor?.location || "",
    consultation_fee: doctor?.consultation_fee || 500,
    available_time: doctor?.available_time || "10:00 AM - 5:00 PM",
    rating: doctor?.rating || 4.5,
    wait_time: doctor?.wait_time || 10,
    qualification: doctor?.qualification || "",
    experience: doctor?.experience || 0,
    clinic_address: doctor?.clinic_address || "",
    city: doctor?.city || "",
    phone: doctor?.phone || "",
    profile_image_url: doctor?.profile_image_url || "",
    credits: doctor?.credits ?? 500,
    is_verified: doctor?.is_verified ?? false,
    is_active: doctor?.is_active ?? true,
    available_days: doctor?.available_days || ["Mon", "Tue", "Wed", "Thu", "Fri"],
    available_slots: doctor?.available_slots || ["10:00", "11:00", "12:00"],
  };
}

function formInputToDoctorPayload(input: DoctorFormInput) {
  return {
    ...input,
    consultation_fee: Number(input.consultation_fee) || 0,
    rating: Number(input.rating) || 0,
    wait_time: Number(input.wait_time) || 0,
    experience: Number(input.experience) || 0,
    credits: Number(input.credits) || 0,
    location: input.location || input.city,
    available_time: input.available_time || input.available_slots.join(", "),
  };
}

export async function createAdminDoctor(input: DoctorFormInput) {
  await requireAdmin();

  const payload = {
    ...formInputToDoctorPayload(input),
    credits: 500,
    is_active: input.is_active,
  };

  if (!supabase) return { ...payload, id: `doctor-${Date.now()}` } as Doctor;

  const { data, error } = await supabase
    .from("doctors")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Doctor;
}

export async function updateAdminDoctor(id: string, input: DoctorFormInput) {
  await requireAdmin();
  const doctorId = id.trim();
  console.log("[Cure AI admin] Updating doctor:", doctorId);

  const payload = formInputToDoctorPayload(input);
  if (!supabase) return { ...payload, id: doctorId } as Doctor;

  if (!doctorId) {
    throw new Error("Missing doctor ID. Open the doctor from the admin doctor list and try again.");
  }

  const response = await supabase
    .from("doctors")
    .update(payload)
    .eq("id", doctorId)
    .select()
    .maybeSingle();

  const { data, error, status, statusText } = response;
  console.log("[Cure AI admin] Supabase doctor update response:", {
    doctorId,
    status,
    statusText,
    data,
    error,
  });

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error(`Doctor not found for ID: ${doctorId}. The record may have been deleted.`);
  }
  return data as Doctor;
}

export async function setDoctorActive(id: string, isActive: boolean) {
  await requireAdmin();

  if (!supabase) return;

  const { error } = await supabase
    .from("doctors")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function createAppointment(input: {
  user: AppUser | null;
  doctor: Doctor;
  symptoms: string;
  specialist: string;
  date: string;
  time: string;
}) {
  const user = await resolveCurrentUser(input.user);

  if (!supabase || !user || user.id.startsWith("patient-demo")) {
    return createLocalAppointment({
      doctor: input.doctor,
      symptoms: input.symptoms,
      specialist: input.specialist,
      date: input.date,
      time: input.time,
      patientId: user?.id,
    });
  }

  console.log("[CureAI Queue] Creating appointment", {
    patientId: user.id,
    doctorId: input.doctor.id,
    date: input.date,
    time: input.time,
  });

  const { data: latestToken, error: latestError } = await supabase
    .from("queue_tokens")
    .select("token_number")
    .eq("doctor_id", input.doctor.id)
    .order("token_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) throw new Error(latestError.message);

  const tokenNumber = ((latestToken?.token_number as number | undefined) || 0) + 1;
  console.log("[CureAI Queue] Generated token number", {
    doctorId: input.doctor.id,
    tokenNumber,
  });

  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert({
      patient_id: user.id,
      doctor_id: input.doctor.id,
      symptoms: input.symptoms,
      specialist_suggested: input.specialist,
      appointment_date: input.date,
      appointment_time: input.time,
      status: "booked",
      token_number: tokenNumber,
    })
    .select()
    .single();

  if (appointmentError) throw new Error(appointmentError.message);

  const { data: currentToken, error: currentTokenError } = await supabase
    .from("queue_tokens")
    .select("id")
    .eq("doctor_id", input.doctor.id)
    .eq("current_status", "current")
    .maybeSingle();

  if (currentTokenError) throw new Error(currentTokenError.message);

  const { data: token, error: tokenError } = await supabase
    .from("queue_tokens")
    .insert({
      doctor_id: input.doctor.id,
      appointment_id: appointment.id,
      token_number: tokenNumber,
      current_status: currentToken ? "waiting" : "current",
    })
    .select()
    .single();

  if (tokenError) throw new Error(tokenError.message);

  console.log("[CureAI Queue] Queue token created", {
    appointmentId: appointment.id,
    tokenId: token.id,
    doctorId: input.doctor.id,
    tokenNumber,
    status: token.current_status,
  });

  return { appointment, token };
}

export async function getPatientAppointments(user: AppUser | null): Promise<AppointmentWithDetails[]> {
  const currentUser = await resolveCurrentUser(user);

  if (!supabase || !currentUser || currentUser.id.startsWith("patient-demo")) {
    return getLocalPatientAppointments(currentUser?.id);
  }

  console.log("[CureAI Queue] Loading patient appointments from Supabase", {
    patientId: currentUser.id,
  });

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*, doctor:doctors(*)")
    .eq("patient_id", currentUser.id)
    .order("appointment_date", { ascending: false })
    .order("token_number", { ascending: false });

  if (error) throw new Error(error.message);

  const appointmentIds = (appointments || []).map((appointment) => appointment.id);
  const { data: tokens, error: tokenError } = appointmentIds.length
    ? await supabase
        .from("queue_tokens")
        .select("*")
        .in("appointment_id", appointmentIds)
    : { data: [], error: null };

  if (tokenError) throw new Error(tokenError.message);

  console.log("[CureAI Queue] Patient appointment tokens retrieved", {
    appointmentCount: appointments?.length || 0,
    tokenCount: tokens?.length || 0,
  });

  return (appointments || []).map((item) => ({
    ...item,
    doctor: Array.isArray(item.doctor) ? item.doctor[0] : item.doctor,
    queue_token: (tokens || []).find((token) => token.appointment_id === item.id),
  })) as AppointmentWithDetails[];
}

export async function getDoctorQueue(doctorId: string): Promise<QueueItem[]> {
  if (!supabase || doctorId.startsWith("doctor-")) {
    return getLocalDoctorQueue(doctorId);
  }

  const { data, error } = await supabase
    .from("queue_tokens")
    .select("*, appointment:appointments(id, patient_id, symptoms, specialist_suggested, appointment_date, appointment_time, token_number, patient:users(id, name, email))")
    .eq("doctor_id", doctorId)
    .not("current_status", "in", "(completed,cancelled)")
    .order("token_number", { ascending: true });

  if (error) throw new Error(error.message);

  const queue = (data || []).map((item) => ({
    token: item as QueueToken,
    appointment: Array.isArray(item.appointment) ? item.appointment[0] : item.appointment,
  })) as QueueItem[];

  console.log("[CureAI Queue] Doctor queue retrieved", {
    doctorId,
    count: queue.length,
    currentToken: queue.find((item) => ["current", "arrived"].includes(item.token.current_status))?.token.token_number || null,
    waitingTokens: queue.filter((item) => ["waiting", "arrived"].includes(item.token.current_status)).length,
  });

  return queue;
}

export async function getTodayAppointments(doctorId: string): Promise<DoctorAppointment[]> {
  if (!supabase || doctorId.startsWith("doctor-")) {
    return getLocalDoctorQueue(doctorId).map((item) => ({
      ...item.appointment,
      patient: { id: item.appointment.patient_id, name: "Demo Patient", email: "patient@demo.cureai" },
      queue_token: item.token,
    }));
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*, patient:users(id, name, email)")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", today)
    .order("appointment_time", { ascending: true });

  if (error) throw new Error(error.message);

  const appointmentIds = (appointments || []).map((appointment) => appointment.id);
  const { data: tokens, error: tokenError } = appointmentIds.length
    ? await supabase.from("queue_tokens").select("*").in("appointment_id", appointmentIds)
    : { data: [], error: null };

  if (tokenError) throw new Error(tokenError.message);

  return (appointments || []).map((appointment) => ({
    ...appointment,
    patient: Array.isArray(appointment.patient) ? appointment.patient[0] : appointment.patient,
    queue_token: (tokens || []).find((token) => token.appointment_id === appointment.id) || null,
  })) as DoctorAppointment[];
}

export async function getDoctorOverview(doctorId: string) {
  const [appointments, queue] = await Promise.all([
    getTodayAppointments(doctorId),
    getDoctorQueue(doctorId),
  ]);

  const waitingPatients = queue.filter((item) =>
    ["waiting", "arrived"].includes(item.token.current_status),
  ).length;
  const completedPatients = appointments.filter(
    (appointment) =>
      appointment.status === "completed" ||
      appointment.queue_token?.current_status === "completed",
  ).length;

  let followUpsDue = 0;
  if (supabase && !doctorId.startsWith("doctor-")) {
    const today = new Date().toISOString().slice(0, 10);
    const { count, error } = await supabase
      .from("doctor_notes")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctorId)
      .lte("follow_up_date", today);
    if (!error) followUpsDue = count || 0;
  }

  return {
    todayAppointments: appointments.length,
    waitingPatients,
    completedPatients,
    followUpsDue,
  };
}

export async function searchPatientByMedicalId(medicalId: string): Promise<Patient | null> {
  if (!supabase) {
    if (medicalId.trim().toUpperCase() !== "CURE-DEMO-001") return null;
    return {
      id: "patient-profile-demo",
      user_id: "patient-demo",
      medical_id: "CURE-DEMO-001",
      name: "Demo Patient",
      age: 32,
      gender: "Female",
      height: 165,
      weight: 62,
      bmi: 22.8,
      phone: "+91 90000 00000",
    };
  }

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .ilike("medical_id", medicalId.trim())
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Patient | null;
}

export async function getPatientProfileBundle(patient: Patient): Promise<PatientProfileBundle> {
  if (!supabase) {
    return { patient, appointments: [], records: [], notes: [] };
  }

  const [appointmentsResult, recordsResult, notesResult] = await Promise.all([
    supabase
      .from("appointments")
      .select("*, patient:users(id, name, email)")
      .eq("patient_id", patient.user_id || patient.id)
      .order("appointment_date", { ascending: false }),
    supabase
      .from("patient_records")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("doctor_notes")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false }),
  ]);

  if (appointmentsResult.error) throw new Error(appointmentsResult.error.message);
  if (recordsResult.error) throw new Error(recordsResult.error.message);
  if (notesResult.error) throw new Error(notesResult.error.message);

  return {
    patient,
    appointments: (appointmentsResult.data || []) as DoctorAppointment[],
    records: (recordsResult.data || []) as PatientRecord[],
    notes: (notesResult.data || []) as DoctorNote[],
  };
}

export async function saveDoctorNote(input: {
  patientId: string;
  doctorId: string;
  appointmentId?: string | null;
  notes: string;
  diagnosis: string;
  prescription: string;
  followUpDate: string;
}) {
  if (!supabase || input.doctorId.startsWith("doctor-")) return;

  const { error } = await supabase.from("doctor_notes").insert({
    patient_id: input.patientId,
    doctor_id: input.doctorId,
    appointment_id: input.appointmentId || null,
    notes: input.notes,
    diagnosis: input.diagnosis,
    prescription: input.prescription,
    follow_up_date: input.followUpDate || null,
  });

  if (error) throw new Error(error.message);
}

export async function updateQueueTokenStatus(input: {
  tokenId: string;
  status: QueueStatus;
  appointmentId?: string;
  appointmentStatus?: "booked" | "completed" | "cancelled";
}) {
  if (!supabase || input.tokenId.startsWith("token-")) {
    updateLocalQueueToken({
      tokenId: input.tokenId,
      status: input.status,
      completeAppointment: input.appointmentStatus === "completed",
      cancelAppointment: input.appointmentStatus === "cancelled",
    });
    return;
  }

  const { error } = await supabase
    .from("queue_tokens")
    .update({ current_status: input.status })
    .eq("id", input.tokenId);

  if (error) throw new Error(error.message);

  if (input.appointmentId && input.appointmentStatus) {
    const { error: appointmentError } = await supabase
      .from("appointments")
      .update({ status: input.appointmentStatus })
      .eq("id", input.appointmentId);

    if (appointmentError) throw new Error(appointmentError.message);
  }
}

export async function callNextPatient(doctorId: string) {
  if (!supabase || doctorId.startsWith("doctor-")) {
    callNextLocalPatient(doctorId);
    return;
  }

  const queue = await getDoctorQueue(doctorId);
  const current = queue.find((item) => ["current", "arrived"].includes(item.token.current_status));
  const nextWaiting = queue.find((item) => ["arrived", "waiting"].includes(item.token.current_status));

  if (current) {
    const { error } = await supabase
      .from("queue_tokens")
      .update({ current_status: "completed" })
      .eq("id", current.token.id);

    if (error) throw new Error(error.message);
  }

  if (nextWaiting) {
    const { error } = await supabase
      .from("queue_tokens")
      .update({ current_status: "current" })
      .eq("id", nextWaiting.token.id);

    if (error) throw new Error(error.message);
  }
}
