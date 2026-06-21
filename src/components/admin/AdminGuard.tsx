"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={["admin"]}>{children}</AuthGuard>;
}
