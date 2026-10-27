import AuthGuard from "@/components/auth/AuthGuard";
const DOCTOR_ROLE = ["doctor"] as const;
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={[...DOCTOR_ROLE]}>{children}</AuthGuard>;
}
