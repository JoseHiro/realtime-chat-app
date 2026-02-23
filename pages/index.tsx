import { LandingHeader } from "../component/ui/LandingPage/LandingHeader";
import { LandingFooter } from "../component/ui/LandingPage/LandingFooter";
import { HeroSection } from "../component/ui/LandingPage/HeroSection";
import { FeatureBody } from "../component/ui/LandingPage/FeatureBody/FeatureBody";
import FeedbackSection from "../component/ui/LandingPage/Feedback/index";
import Suggestion from "../component/ui/LandingPage/Suggestion/index";

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      <LandingHeader />
      <HeroSection />
      <FeatureBody />
      <FeedbackSection />
      <Suggestion />
      <LandingFooter />
    </div>
  );
}
