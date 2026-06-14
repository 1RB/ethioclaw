import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimateOnView } from "~/components/core/animate-on-view";

export function BottomCtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:px-8 md:py-28 lg:py-36">
      <AnimateOnView className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
        <h2 className="font-serif-display text-3xl font-normal leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
          Stop doing work your agent could handle.
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Thousands of tasks automated. One agent. Zero setup. 
          <strong className="text-foreground"> Launch yours in seconds.</strong>
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" />
          Launch Your Agent
          <ArrowRight className="h-4 w-4" />
        </Link>
      </AnimateOnView>
    </section>
  );
}
