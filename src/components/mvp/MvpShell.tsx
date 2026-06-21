import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

type MvpShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function MvpShell({ eyebrow, title, description, children }: MvpShellProps) {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A66FF] mb-8"
          >
            <Activity className="w-4 h-4" />
            Cure AI MVP
          </Link>
          <div className="max-w-3xl">
            <p className="text-[#0A66FF] font-semibold uppercase tracking-wider text-xs mb-3">
              {eyebrow}
            </p>
            <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
              {title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {children}
      </section>
    </main>
  );
}

export function MvpCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryAction({
  children,
  type = "button",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A66FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

export function StatusMessage({
  type,
  children,
}: {
  type: "loading" | "error" | "empty" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    loading: "bg-blue-50 text-blue-700 border-blue-100",
    error: "bg-rose-50 text-rose-700 border-rose-100",
    empty: "bg-slate-50 text-slate-600 border-slate-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${styles[type]}`}>
      {children}
    </div>
  );
}
