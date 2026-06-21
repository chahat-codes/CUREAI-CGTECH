"use client";

import { useEffect, useState } from "react";
import { Check, Clock, PhoneCall, SkipForward, UserCheck, X } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import MvpShell, { MvpCard, PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
import {
  callNextPatient,
  getActiveDoctorId,
  getDoctorQueue,
  updateQueueTokenStatus,
} from "@/lib/mvp-api";
import type { QueueStatus } from "@/lib/mvp-types";

type QueueItem = Awaited<ReturnType<typeof getDoctorQueue>>[number];

export default function ReceptionistDashboardPage() {
  const [doctorId, setDoctorId] = useState("doctor-gp-1");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingTokenId, setWorkingTokenId] = useState("");
  const [error, setError] = useState("");

  const current = queue.find((item) => item.token.current_status === "current");
  const waitingTokens = queue.filter((item) =>
    ["waiting", "arrived"].includes(item.token.current_status),
  );

  const loadQueue = async () => {
    setLoading(true);
    setError("");
    try {
      const resolvedDoctorId = await getActiveDoctorId();
      setDoctorId(resolvedDoctorId);
      setQueue(await getDoctorQueue(resolvedDoctorId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Loads queue state from Supabase/local demo on first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQueue();
  }, []);

  const updateToken = async (
    item: QueueItem,
    status: QueueStatus,
    appointmentStatus?: "booked" | "completed" | "cancelled",
  ) => {
    setWorkingTokenId(item.token.id);
    setError("");
    try {
      await updateQueueTokenStatus({
        tokenId: item.token.id,
        status,
        appointmentId: item.appointment.id,
        appointmentStatus,
      });
      await loadQueue();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update queue token.");
    } finally {
      setWorkingTokenId("");
    }
  };

  const handleCallNext = async () => {
    setWorkingTokenId("call-next");
    setError("");
    try {
      await callNextPatient(doctorId);
      await loadQueue();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not call next patient.");
    } finally {
      setWorkingTokenId("");
    }
  };

  return (
    <AuthGuard roles={["receptionist"]}>
      <MvpShell
        eyebrow="Receptionist dashboard"
        title="Front desk queue control."
        description="Track arrival, call the next patient, skip tokens, complete appointments, and cancel bookings."
      >
      {loading && <StatusMessage type="loading">Loading today’s queue...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-4">
          <MvpCard className="bg-[#0F172A] text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Current token</p>
            <h2 className="font-outfit text-6xl font-black">
              {current ? `#${current.token.token_number}` : "--"}
            </h2>
            <p className="mt-2 text-slate-300">
              {current ? current.appointment.symptoms : "No active patient."}
            </p>
          </MvpCard>

          <MvpCard>
            <p className="text-sm font-semibold text-slate-500">Waiting tokens</p>
            <p className="font-outfit text-5xl font-black text-slate-950">{waitingTokens.length}</p>
            <div className="mt-5">
              <PrimaryAction onClick={handleCallNext} disabled={workingTokenId === "call-next"}>
                {workingTokenId === "call-next" ? "Calling..." : "Call Next Patient"}
              </PrimaryAction>
            </div>
          </MvpCard>
        </div>

        <MvpCard>
          <h2 className="font-outfit text-2xl font-extrabold text-slate-950 mb-4">
            Today’s queue
          </h2>
          <div className="space-y-3">
            {!loading && queue.length === 0 && (
              <StatusMessage type="empty">No queue tokens for today.</StatusMessage>
            )}
            {queue.map((item) => (
              <div key={item.token.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="font-outfit text-xl font-black text-slate-950">
                      Token #{item.token.token_number}
                    </p>
                    <p className="text-sm text-slate-600">
                      {item.appointment.patient?.name || "Patient"} · {item.appointment.appointment_time}
                    </p>
                    <p className="text-sm text-slate-500">{item.appointment.symptoms}</p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-slate-600">
                    {item.token.current_status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <QueueButton
                    icon={<UserCheck className="w-4 h-4" />}
                    label="Mark Arrived"
                    disabled={workingTokenId === item.token.id}
                    onClick={() => updateToken(item, "arrived")}
                  />
                  <QueueButton
                    icon={<PhoneCall className="w-4 h-4" />}
                    label="Call"
                    disabled={workingTokenId === item.token.id}
                    onClick={() => updateToken(item, "current")}
                  />
                  <QueueButton
                    icon={<SkipForward className="w-4 h-4" />}
                    label="Skip"
                    disabled={workingTokenId === item.token.id}
                    onClick={() => updateToken(item, "skipped")}
                  />
                  <QueueButton
                    icon={<Check className="w-4 h-4" />}
                    label="Complete"
                    disabled={workingTokenId === item.token.id}
                    onClick={() => updateToken(item, "completed", "completed")}
                  />
                  <QueueButton
                    icon={<X className="w-4 h-4" />}
                    label="Cancel"
                    disabled={workingTokenId === item.token.id}
                    onClick={() => updateToken(item, "cancelled", "cancelled")}
                  />
                </div>
              </div>
            ))}
          </div>
        </MvpCard>
      </div>
      </MvpShell>
    </AuthGuard>
  );
}

function QueueButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-[#0A66FF] hover:text-[#0A66FF] disabled:opacity-50"
    >
      {disabled ? <Clock className="w-4 h-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}
