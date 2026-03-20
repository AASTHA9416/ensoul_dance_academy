import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StyleExplorer from "../components/StyleExplorer";
import StudioInfoSection from "../components/StudioInfoSection";
import LeadGenerationForm from "../components/LeadGenerationForm";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StyleExplorer />
      <StudioInfoSection />
      <div className="hidden md:block">
        <LeadGenerationForm />
      </div>
    </>
  );
}
