import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { FeatureCards } from "@/components/landing/feature-cards";
import { Workflow } from "@/components/landing/workflow";
import { TechStack } from "@/components/landing/tech-stack";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeatureCards />
      <Workflow />
      <TechStack />
    </>
  );
}
