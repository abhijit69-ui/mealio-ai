import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import PricingSection from "@/components/landing/PricingSection";

export default async function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </main>
  );
}
