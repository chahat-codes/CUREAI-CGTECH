export type DemoAppointmentStatus = "Scheduled" | "Checked in" | "Waiting" | "In consultation" | "Completed";
export type DemoAppointment = {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: DemoAppointmentStatus;
  checkedInAt: string | null;
  queuePosition: number | null;
  emergency: boolean;
  emergencyAcknowledged: boolean;
  priority: boolean;
  called?: boolean;
  consultationStartedAt: string | null;
  consultationCompletedAt: string | null;
  expectedMinutes: number;
};
export type CapacitySetting = { maxBookings: number; manuallyClosed: boolean };
export type ReceptionistDemoState = { appointments: DemoAppointment[]; capacities: Record<string, CapacitySetting> };

const STORAGE_KEY = "cureai-receptionist-demo-v1";
export const DEFAULT_BOOKING_CAPACITY = 24;
const doctors = ["Dr. Meera Patel", "Dr. S. Reddy", "Dr. Anita Rao"];
const times = ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"];

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function seedState(): ReceptionistDemoState {
  const today = localDateKey();
  const statuses: DemoAppointmentStatus[] = ["In consultation", "Waiting", "Checked in", "Scheduled", "Scheduled", "Scheduled", "Scheduled", "Scheduled"];
  const appointments = times.map((time, index): DemoAppointment => ({
    id: `CA-${today.replaceAll("-", "").slice(2)}-${String(481 + index).padStart(4, "0")}`,
    patient: `Patient ${String.fromCharCode(65 + index)}•••`,
    doctor: doctors[index % doctors.length], date: today, time, status: statuses[index],
    checkedInAt: index > 0 && index < 3 ? `${String(9 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "47" : "38"}` : null,
    queuePosition: index === 0 ? null : index < 4 ? index : null,
    emergency: false, emergencyAcknowledged: false, priority: false,
    consultationStartedAt: index === 0 ? "09:56" : null, consultationCompletedAt: null, expectedMinutes: 15,
  }));
  return { appointments, capacities: { [today]: { maxBookings: DEFAULT_BOOKING_CAPACITY, manuallyClosed: false } } };
}

export function loadDemoState(): ReceptionistDemoState {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const value = JSON.parse(raw) as ReceptionistDemoState;
    if (!Array.isArray(value.appointments) || !value.capacities) return seedState();
    return value;
  } catch { return seedState(); }
}

export function saveDemoState(state: ReceptionistDemoState) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function makeAppointmentPatch(state: ReceptionistDemoState, id: string, patch: Partial<DemoAppointment>): ReceptionistDemoState {
  return { ...state, appointments: state.appointments.map((appointment) => appointment.id === id ? { ...appointment, ...patch } : appointment) };
}

export function bookedCountForDate(state: ReceptionistDemoState, date: string) {
  return state.appointments.filter((appointment) => appointment.date === date && appointment.status !== "Completed").length;
}

export function getCapacity(state: ReceptionistDemoState, date: string): CapacitySetting {
  return state.capacities[date] || { maxBookings: DEFAULT_BOOKING_CAPACITY, manuallyClosed: false };
}

export function setCapacity(state: ReceptionistDemoState, date: string, setting: CapacitySetting): ReceptionistDemoState {
  return { ...state, capacities: { ...state.capacities, [date]: setting } };
}

export function isBookingClosed(state: ReceptionistDemoState, date: string) {
  const setting = getCapacity(state, date);
  return setting.manuallyClosed || bookedCountForDate(state, date) >= setting.maxBookings;
}

export function estimateWaitMinutes(queuePosition: number, expectedMinutes = 15) {
  return Math.max(0, queuePosition) * expectedMinutes;
}

export function averageActualWaitMinutes(appointments: DemoAppointment[]) {
  const waits = appointments.flatMap((appointment) => {
    if (!appointment.checkedInAt || !appointment.consultationStartedAt) return [];
    const [checkHour, checkMinute] = appointment.checkedInAt.split(":").map(Number);
    const [startHour, startMinute] = appointment.consultationStartedAt.split(":").map(Number);
    const minutes = startHour * 60 + startMinute - (checkHour * 60 + checkMinute);
    return minutes >= 0 ? [minutes] : [];
  });
  return waits.length ? Math.round(waits.reduce((sum, wait) => sum + wait, 0) / waits.length) : null;
}
