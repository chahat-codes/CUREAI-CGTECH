"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MvpShell, { StatusMessage } from "@/components/mvp/MvpShell";
import { getCurrentSession, getProfileForSession, routeForRole } from "@/lib/auth";
import { getUser } from "@/lib/mvp-storage";
import type { UserRole } from "@/lib/mvp-types";
import { supabase } from "@/lib/supabase";

type AuthGuardProps = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export default function AuthGuard({ children, roles }: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const session = await getCurrentSession();
        const profile = await getProfileForSession(session);
        const demoUser = getUser();
        const user = profile || demoUser;

        if (!session && !demoUser) {
          router.replace("/login");
          return;
        }

        if (roles?.length && user && !roles.includes(user.role)) {
          router.replace(routeForRole(user.role));
          return;
        }

        setStatus("allowed");
      } catch {
        router.replace("/login");
      }
    };

    checkAccess();

    const { data } =
      supabase?.auth.onAuthStateChange(() => {
        checkAccess();
      }) || { data: null };

    return () => {
      data?.subscription.unsubscribe();
    };
  }, [roles, router]);

  if (status === "checking") {
    return (
      <MvpShell
        eyebrow="Secure area"
        title="Checking your session."
        description="Please wait while Cure AI verifies access."
      >
        <StatusMessage type="loading">Verifying session...</StatusMessage>
      </MvpShell>
    );
  }

  return <>{children}</>;
}
