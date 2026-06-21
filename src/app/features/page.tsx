import Hero from "@/components/Hero";
import Solution from "@/components/Solution";
import FeaturesDeepDive from "@/components/FeaturesDeepDive";
import LiveQueue from "@/components/LiveQueue";
import HealthScore from "@/components/HealthScore";
import PrescriptionReader from "@/components/PrescriptionReader";
import HealthTimeline from "@/components/HealthTimeline";
import RiskMonitoring from "@/components/RiskMonitoring";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Features | Cure AI",
  description: "Explore the advanced AI healthcare features powering Cure AI.",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-20">
      <Hero />
      <Solution />
      <FeaturesDeepDive />
      <LiveQueue />
      <HealthScore />
      <PrescriptionReader />
      <HealthTimeline />
      <RiskMonitoring />
      <CTASection />
    </main>
  );
}
