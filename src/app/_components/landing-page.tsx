import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { SecuritySection } from "./security-section";
import { ComparisonSection } from "./comparison-section";
import { TestimonialsSection } from "./testimonials-section";
import { BottomCtaSection } from "./bottom-cta-section";
import { EthioClawBrand } from "./ethioclaw-brand";

export function LandingPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden">
      <LandingNav />
      <main className="flex-1 pt-14">
        <HeroSection />
        <FeaturesSection />
        <SecuritySection />
        <ComparisonSection />
        <TestimonialsSection />
        <BottomCtaSection />
      </main>
      <footer className="border-border border-t px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <EthioClawBrand size="sm" />
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="text-border">|</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="text-border">|</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Status</span>
            <span className="text-border">|</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">GitHub</span>
          </div>
          <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            &copy; 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
