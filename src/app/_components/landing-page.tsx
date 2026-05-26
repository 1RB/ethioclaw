import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { SecuritySection } from "./security-section";
import { ComparisonSection } from "./comparison-section";
import { FloatingPromptsSection } from "./floating-prompts-section";
import { TestimonialsSection } from "./testimonials-section";
import { BottomCtaSection } from "./bottom-cta-section";
import { EthioClawBrand } from "./ethioclaw-brand";
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden">
      <LandingNav />
      <main className="flex-1 pt-14">
        <HeroSection />
        <FeaturesSection />
        <SecuritySection />
        <ComparisonSection />
        <FloatingPromptsSection />
        <TestimonialsSection />
        <BottomCtaSection />
      </main>
      <footer className="border-t-2 border-border px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <EthioClawBrand size="sm" />
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="text-border hidden sm:inline">|</span>
            <Link href="/status" className="hover:text-foreground transition-colors">Status</Link>
            <span className="text-border hidden sm:inline">|</span>
            <a href="https://github.com/ComposioHQ/trustclaw" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
          <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            &copy; 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
