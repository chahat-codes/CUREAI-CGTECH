"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneHome = pathname === "/";
  const isAuthPage = ["/login", "/register", "/auth/callback", "/reset-password"].includes(pathname);
  const isReceptionistPortal = pathname.startsWith("/clinics/receptionist");

  if (isStandaloneHome) return <div className="flex-grow">{children}</div>;
  if (isAuthPage) return <><HomeHeader /><div className="flex-grow">{children}</div></>;
  if (isReceptionistPortal) return <div className="flex-grow">{children}</div>;

  return <><Navbar /><main className="flex-grow pt-20">{children}</main><Footer /></>;
}
