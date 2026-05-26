import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimateOnView } from "~/components/core/animate-on-view";

export function BottomCtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:px-8 md:py-28 lg:py-36">
      <AnimateOnView className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
        <h2 className="font-serif-display text-3xl font-medium leading-[1.02] tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Ready to meet your personal assistant?
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Your AI is waiting. Set it up in seconds.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 border-2 border-border px-8 py-3 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Get Started Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </AnimateOnView>
    </section>
  );
}
