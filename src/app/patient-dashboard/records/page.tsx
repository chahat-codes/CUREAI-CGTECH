"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { FileImage, FileText, Search, Trash2, UploadCloud } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import MvpShell, { MvpCard, StatusMessage } from "@/components/mvp/MvpShell";

type LocalRecord = { id: string; file: File; type: string; url: string };
const maxSize = 8 * 1024 * 1024;

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const visible = useMemo(() => records.filter((record) => `${record.file.name} ${record.type}`.toLowerCase().includes(filter.toLowerCase())), [records, filter]);
  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = Array.from(event.target.files || []);
    const invalid = files.find((file) => !(file.type === "application/pdf" || file.type.startsWith("image/")) || file.size > maxSize);
    if (invalid) { setError("Choose PDF or image files up to 8 MB each."); event.target.value = ""; return; }
    setRecords((existing) => [...files.map((file) => ({ id: `${Date.now()}-${Math.random()}`, file, type: file.type === "application/pdf" ? "PDF" : "Image", url: URL.createObjectURL(file) })), ...existing]);
    event.target.value = "";
  };
  const remove = (item: LocalRecord) => { URL.revokeObjectURL(item.url); setRecords((items) => items.filter((record) => record.id !== item.id)); };
  return <AuthGuard roles={["patient"]}><MvpShell eyebrow="Patient Vault" title="Your health records" description="Review files you&apos;ve opened in this session and keep documents close at hand.">
    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"><strong>Private demo workspace.</strong> Files stay only in this browser tab&apos;s memory and are cleared when it closes or refreshes. They are not uploaded or shared. Avoid adding sensitive records until secure patient storage is configured.</div>
    <div className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
      <MvpCard className="h-fit"><label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-7 text-center hover:border-blue-400"><UploadCloud className="size-8 text-blue-700"/><span className="mt-3 font-bold text-slate-800">Add a record for this session</span><span className="mt-1 text-xs text-slate-500">PDF, JPG, PNG · up to 8 MB</span><input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" multiple onChange={addFiles}/></label>{error && <div className="mt-4"><StatusMessage type="error">{error}</StatusMessage></div>}<p className="mt-4 text-xs leading-5 text-slate-500">File previews open on this device. A secure storage connection is required for records to persist between visits.</p></MvpCard>
      <MvpCard><label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"><Search className="size-4 text-slate-400"/><input value={filter} onChange={(event)=>setFilter(event.target.value)} placeholder="Search this session's files" aria-label="Search records" className="min-w-0 flex-1 outline-none"/></label>
        {visible.length === 0 ? <div className="py-12 text-center"><FileText className="mx-auto size-9 text-slate-300"/><h2 className="mt-3 font-bold text-slate-800">{filter ? "No matching records" : "No records in this session"}</h2><p className="mt-2 text-sm text-slate-500">Uploaded items appear here until this tab is closed.</p><Link href="/patient-dashboard" className="mt-4 inline-block text-sm font-bold text-blue-700">Back to dashboard</Link></div> : <ul className="mt-4 divide-y divide-slate-100">{visible.map((record)=><li key={record.id} className="flex items-center gap-3 py-4"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-50 text-blue-700">{record.type === "PDF" ? <FileText className="size-5"/> : <FileImage className="size-5"/>}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-800">{record.file.name}</span><span className="text-xs text-slate-500">{record.type} · {(record.file.size / 1024 / 1024).toFixed(1)} MB · Added just now</span></span><a href={record.url} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">Preview</a><button onClick={()=>remove(record)} aria-label={`Delete ${record.file.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="size-4"/></button></li>)}</ul>}
      </MvpCard>
    </div>
  </MvpShell></AuthGuard>;
}
