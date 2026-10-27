"use client";
import { LockKeyhole } from "lucide-react";
import { PatientGuard } from "@/components/auth/PatientGuard";
export default function VaultPage() {
  return <PatientGuard><main className="page-shell"><section className="panel"><p className="eyebrow">My Vault</p><h1>Health records</h1><p className="muted">Your private health vault is ready. Records will appear here once securely connected to your account.</p><div className="vault-empty"><span><LockKeyhole size={24}/></span><strong>No records yet</strong><p>Medical records and prescriptions are not connected in this preview. When enabled, only you will be able to access your files.</p></div></section></main></PatientGuard>;
}
