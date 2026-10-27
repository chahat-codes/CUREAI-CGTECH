"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const menuItems = [["My Profile", "/dashboard"], ["My Appointments", "/booking"], ["My Vault", "/vault"], ["Doctor Dashboard", "/doctor-dashboard"], ["Receptionist Dashboard", "/receptionist-dashboard"], ["Admin Dashboard", "/admin-dashboard"]];
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><Link className="brand" href="/"><span className="brand-mark">C</span><span>Cure AI</span></Link><nav className="top-nav"><Link href="/symptoms">Symptom assistant</Link><Link href="/doctors/ananya-rao">Doctors</Link><Link href="/dashboard">Dashboard</Link></nav><div className="header-auth"><Link className="button secondary header-login" href="/login">Login</Link><Link className="button" href="/register">Create Cure ID</Link></div><button className="icon-button" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22}/></button>{open && <div className="menu-backdrop" onClick={() => setOpen(false)}><aside className="menu-panel" onClick={(event) => event.stopPropagation()}><button className="icon-button menu-close" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20}/></button><Link href="/login" onClick={() => setOpen(false)}>Login</Link><Link href="/register" onClick={() => setOpen(false)}>Create Cure ID</Link>{menuItems.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</aside></div>}</header>;
}
