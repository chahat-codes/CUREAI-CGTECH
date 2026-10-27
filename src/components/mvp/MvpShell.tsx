import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type MvpShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function MvpShell({ eyebrow, title, description, children }: MvpShellProps) {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <section className="border-b border-[#e6eeeb] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link href="/" aria-label="Cure AI home" className="mb-8 inline-flex items-center gap-2">
            <Image
              src="/cure-ai-logo-mark.png"
              alt="Cure AI"
              width={96}
              height={96}
              className="size-11 object-contain"
            />
            <span className="font-outfit text-3xl font-extrabold leading-none tracking-tight text-[#173c32]">
              cure <span className="text-[#0A66FF]">ai</span>
            </span>
          </Link>
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-[#14734b]">
              {eyebrow}
            </p>
            <h1 className="mb-4 font-outfit text-4xl font-extrabold tracking-tight text-[#172b35] md:text-5xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {children}
      </section>
    </div>
  );
}

export function MvpCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#e4ece8] bg-white p-5 shadow-sm md:p-6 ${className}`}>
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
