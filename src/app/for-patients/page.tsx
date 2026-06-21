import MedicineReminders from "@/components/MedicineReminders";
import WearableIntegration from "@/components/WearableIntegration";
import FamilyDashboard from "@/components/FamilyDashboard";
import EmergencyMode from "@/components/EmergencyMode";
import HealthVault from "@/components/HealthVault";
import AICompanion from "@/components/AICompanion";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "For Patients | Cure AI",
  description: "Cure AI provides patients with powerful tools for managing health, records, and family care.",
};

export default function ForPatientsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-20">
      <div className="bg-[#0F172A] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-outfit font-extrabold mb-4">Empowering Patients Everywhere</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Your health in your hands. Manage records, monitor loved ones, and access emergency care instantly.</p>
      </div>
      <AICompanion />
      <HealthVault />
      <MedicineReminders />
      <WearableIntegration />
      <FamilyDashboard />
      <EmergencyMode />
      <CTASection />
    </main>
  );
}
