"use client";

import { demoDoctors } from "./demo-data";
import type {
  Appointment,
  AppointmentWithDetails,
  AppUser,
  Doctor,
  MvpFlow,
  QueueToken,
  QueueStatus,
} from "./mvp-types";

const FLOW_KEY = "cure-ai-flow";
const USER_KEY = "cure-ai-user";
const APPOINTMENTS_KEY = "cure-ai-appointments";
const TOKENS_KEY = "cure-ai-queue-tokens";

const demoPatient: AppUser = {
  id: "patient-demo",
  name: "Demo Patient",
  email: "patient@demo.cureai",
  role: "patient",
};

const demoDoctorUser: AppUser = {
  id: "doctor-gp-1",
  name: "Dr. Rahul Sharma",
  email: "doctor@demo.cureai",
  role: "doctor",
};

const demoReceptionistUser: AppUser = {
  id: "receptionist-demo",
  name: "Demo Receptionist",
  email: "receptionist@demo.cureai",
  role: "receptionist",
};

const demoAdminUser: AppUser = {
  id: "admin-demo",
  name: "Demo Admin",
  email: "admin@demo.cureai",
  role: "admin",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function saveFlow(flow: MvpFlow) {
  writeJson(FLOW_KEY, flow);
}

export function getFlow() {
  return readJson<MvpFlow | null>(FLOW_KEY, null);
}

export function saveUser(user: AppUser) {
  writeJson(USER_KEY, user);
}

export function getUser() {
  return readJson<AppUser | null>(USER_KEY, null);
}

export function setDemoUser(role: "patient" | "doctor" | "receptionist" | "admin") {
  const user =
    role === "patient"
      ? demoPatient
      : role === "doctor"
        ? demoDoctorUser
        : role === "receptionist"
          ? demoReceptionistUser
          : demoAdminUser;
  saveUser(user);
  return user;
}

export function saveSelectedDoctor(doctor: Doctor) {
  const flow = getFlow();
  saveFlow({
    symptoms: flow?.symptoms || "",
    specialist: flow?.specialist || doctor.specialization,
    doctor,
  });
}

function getAppointments() {
  return readJson<Appointment[]>(APPOINTMENTS_KEY, []);
}

function getTokens() {
  return readJson<QueueToken[]>(TOKENS_KEY, []);
}

function doctorForAppointment(appointment: Appointment) {
  return demoDoctors.find((doctor) => doctor.id === appointment.doctor_id) || demoDoctors[0];
}

export function getLocalPatientAppointments(patientId = demoPatient.id): AppointmentWithDetails[] {
  const tokens = getTokens();

  return getAppointments()
    .filter((appointment) => appointment.patient_id === patientId)
    .map((appointment) => ({
      ...appointment,
      doctor: doctorForAppointment(appointment),
      queue_token: tokens.find((token) => token.appointment_id === appointment.id),
    }))
    .sort((a, b) => b.token_number - a.token_number);
}

export function getLocalDoctorQueue(doctorId: string) {
  const appointments = getAppointments().filter((appointment) => appointment.doctor_id === doctorId);
  const tokens = getTokens().filter((token) => token.doctor_id === doctorId);

  return tokens
    .map((token) => ({
      token,
      appointment: appointments.find((appointment) => appointment.id === token.appointment_id),
    }))
    .filter((item): item is { token: QueueToken; appointment: Appointment } => Boolean(item.appointment))
    .sort((a, b) => a.token.token_number - b.token.token_number);
}

export function createLocalAppointment(input: {
  doctor: Doctor;
  symptoms: string;
  specialist: string;
  date: string;
  time: string;
  patientId?: string;
}) {
  const appointments = getAppointments();
  const tokens = getTokens();
  const doctorTokens = tokens.filter((token) => token.doctor_id === input.doctor.id);
  const tokenNumber = doctorTokens.reduce((max, token) => Math.max(max, token.token_number), 0) + 1;
  const hasCurrent = doctorTokens.some((token) => token.current_status === "current");
  const appointmentId = `appointment-${Date.now()}`;
  const patientId = input.patientId || getUser()?.id || demoPatient.id;

  const appointment: Appointment = {
    id: appointmentId,
    patient_id: patientId,
    doctor_id: input.doctor.id,
    symptoms: input.symptoms,
    specialist_suggested: input.specialist,
    appointment_date: input.date,
    appointment_time: input.time,
    status: "booked",
    token_number: tokenNumber,
  };

  const token: QueueToken = {
    id: `token-${Date.now()}`,
    doctor_id: input.doctor.id,
    appointment_id: appointmentId,
    token_number: tokenNumber,
    current_status: hasCurrent ? "waiting" : "current",
    created_at: new Date().toISOString(),
  };

  writeJson(APPOINTMENTS_KEY, [...appointments, appointment]);
  writeJson(TOKENS_KEY, [...tokens, token]);

  return { appointment, token };
}

export function callNextLocalPatient(doctorId: string) {
  const tokens = getTokens();
  const doctorTokens = tokens
    .filter((token) => token.doctor_id === doctorId)
    .sort((a, b) => a.token_number - b.token_number);
  const current = doctorTokens.find((token) => token.current_status === "current");
  const nextWaiting = doctorTokens.find((token) => token.current_status === "waiting");

  const updated = tokens.map((token) => {
    if (current && token.id === current.id) {
      return { ...token, current_status: "completed" as QueueStatus };
    }

    if (nextWaiting && token.id === nextWaiting.id) {
      return { ...token, current_status: "current" as QueueStatus };
    }

    return token;
  });

  writeJson(TOKENS_KEY, updated);
}

export function updateLocalQueueToken(input: {
  tokenId: string;
  status: QueueStatus;
  completeAppointment?: boolean;
  cancelAppointment?: boolean;
}) {
  const tokens = getTokens().map((token) =>
    token.id === input.tokenId ? { ...token, current_status: input.status } : token,
  );
  const target = tokens.find((token) => token.id === input.tokenId);

  writeJson(TOKENS_KEY, tokens);

  if (target && (input.completeAppointment || input.cancelAppointment)) {
    const appointments = getAppointments().map((appointment) => {
      if (appointment.id !== target.appointment_id) return appointment;
      return {
        ...appointment,
        status: input.completeAppointment ? "completed" as const : "cancelled" as const,
      };
    });
    writeJson(APPOINTMENTS_KEY, appointments);
  }
}
