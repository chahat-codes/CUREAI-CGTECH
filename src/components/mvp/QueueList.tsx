import { CheckCircle2, Clock, UserRound } from "lucide-react";
import { MvpCard } from "./MvpShell";

type QueueListProps = {
  items: Array<{
      token: {
        token_number: number;
        current_status: "waiting" | "arrived" | "current" | "completed" | "skipped" | "cancelled";
      };
    appointment: {
      symptoms: string;
      appointment_time: string;
    };
  }>;
};

export default function QueueList({ items }: QueueListProps) {
  if (items.length === 0) {
    return (
      <MvpCard>
        <p className="text-sm font-semibold text-slate-500">No patients are waiting right now.</p>
      </MvpCard>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isCurrent = item.token.current_status === "current";

        return (
          <MvpCard
            key={`${item.token.token_number}-${item.appointment.appointment_time}`}
            className={isCurrent ? "border-blue-200 bg-blue-50" : ""}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-3 ${isCurrent ? "bg-[#0A66FF] text-white" : "bg-slate-100 text-slate-500"}`}>
                  {isCurrent ? <UserRound className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-outfit text-xl font-black text-slate-950">
                    Token #{item.token.token_number}
                  </p>
                  <p className="text-sm text-slate-600">
                    {item.appointment.symptoms} · {item.appointment.appointment_time}
                  </p>
                </div>
              </div>
              <span className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                isCurrent ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
              }`}>
                {item.token.current_status === "completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {item.token.current_status}
              </span>
            </div>
          </MvpCard>
        );
      })}
    </div>
  );
}
