import Telemedicine from "@/components/Telemedicine";
import PreventiveCare from "@/components/PreventiveCare";
import NearbyEcosystem from "@/components/NearbyEcosystem";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "For Clinics & Hospitals | Cure AI",
  description: "Empower your medical practice with Cure AI's clinic management and telemedicine tools.",
};

export default function ForClinicsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-20">
      <div className="bg-[#0A66FF] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-outfit font-extrabold mb-4">Smart Tools for Modern Clinics</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">Streamline operations, boost patient retention, and expand your reach with AI-driven clinic management.</p>
      </div>
      <Telemedicine />
      <PreventiveCare />
      <NearbyEcosystem />
      <CTASection />
    </main>
  );
}
