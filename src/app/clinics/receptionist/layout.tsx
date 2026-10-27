import ReceptionistPortal from "@/components/receptionist/ReceptionistPortal";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  return <ReceptionistPortal>{children}</ReceptionistPortal>;
}
