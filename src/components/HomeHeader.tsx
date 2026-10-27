"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import EmergencyAssistance from "@/components/EmergencyAssistance";
import { getCurrentSession, getProfileForSession, logout, routeForRole } from "@/lib/auth";
import { getUser } from "@/lib/mvp-storage";
import type { UserRole } from "@/lib/mvp-types";

const links = [["Home", "/"], ["AI Health Assistant", "/ai-health-assistant"], ["Find Doctors", "/find-doctor"], ["Video Consult", "/video-consult"], ["How It Works", "/#how-it-works"], ["For Clinics", "/for-clinics"]];

export default function HomeHeader() {
  const [role, setRole] = useState<UserRole | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try { const session = await getCurrentSession(); const profile = await getProfileForSession(session); if (active) setRole((profile || getUser())?.role || null); }
      catch { if (active) setRole(getUser()?.role || null); }
    };
    load();
    return () => { active = false; };
  }, []);
  const handleLogout = async () => { await logout(); setRole(null); };
  return <header className="sticky top-0 z-40 border-b border-[#e6eeeb] bg-[#f8faf9]/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2 sm:px-6 lg:flex-nowrap lg:px-8 lg:py-0">
      <Link href="/" aria-label="Cure AI home" className="flex min-h-[56px] shrink-0 items-center gap-2"><Image src="/cure-ai-logo-mark.png" alt="" width={42} height={42} priority className="size-10 object-contain"/><span className="font-outfit text-[23px] font-extrabold tracking-tight">cure <span className="text-[#1768ee]">ai</span></span></Link>
      <nav aria-label="Main navigation" className="order-3 -mx-4 flex w-[calc(100%+2rem)] items-center gap-5 overflow-x-auto border-t border-[#e6eeeb] px-4 py-2 text-[13px] font-semibold text-[#52636a] whitespace-nowrap [scrollbar-width:thin] sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:justify-center lg:gap-5 lg:overflow-visible lg:border-0 lg:px-0 lg:py-0">{links.map(([label,href])=><Link key={label} href={href} className="shrink-0 rounded-md transition hover:text-[#1768ee] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">{label}</Link>)}</nav>
      <div className="ml-auto flex shrink-0 items-center gap-1.5"><EmergencyAssistance compact/>{role ? <><Link href={routeForRole(role)} className="rounded-xl px-2 py-2 text-xs font-bold text-[#40535b] hover:bg-white sm:px-3 sm:text-sm">My care</Link><button onClick={handleLogout} className="rounded-xl px-2 py-2 text-xs font-semibold text-[#687a7d] hover:text-rose-700">Log out</button></> : <a href="/login" className="whitespace-nowrap rounded-xl px-2 py-2 text-xs font-bold text-[#40535b] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:px-3 sm:text-sm">Login / Sign Up</a>}</div>
    </div>
  </header>;
}
