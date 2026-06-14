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

function SectionDivider() {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden">
      <LandingNav />
      <main className="flex-1 pt-14">
        <HeroSection />
        <SectionDivider />
        <FeaturesSection />
        <SectionDivider />
        <SecuritySection />
        <SectionDivider />
        <ComparisonSection />
        <div className="bg-muted/30">
          <FloatingPromptsSection />
        </div>
        <SectionDivider />
        <TestimonialsSection />
        <BottomCtaSection />
      </main>
      <footer className="border-t border-border/60 px-6 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <EthioClawBrand size="sm" />
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/status" className="transition-colors hover:text-foreground">
              Status
            </Link>
          </div>
          <span className="text-muted-foreground text-xs">
            &copy; 2026 EthioClaw
          </span>
        </div>
      </footer>
    </div>
  );
}
