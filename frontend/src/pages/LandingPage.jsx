import { Hero } from "../components/landing/Hero";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { HowItWorks } from "../components/landing/HowItWorks";
import { StackBand } from "../components/landing/StackBand";
import { CtaBand } from "../components/landing/CtaBand";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <StackBand />
      <CtaBand />
    </>
  );
}
