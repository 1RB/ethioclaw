import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateOnView } from "~/components/core/animate-on-view";

export function BottomCtaSection() {
  return (
    <section className="border-b-2 border-border px-4 py-16 md:px-8 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <AnimateOnView className="flex flex-col items-start gap-6 md:gap-8">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">
            INITIALIZATION
          </p>
          <h2 className="text-foreground text-3xl font-bold leading-none tracking-tight md:text-5xl lg:text-7xl">
            READY TO
            <br />
            <span className="text-primary">DEPLOY?</span>
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Your agent is waiting. Connect your tools. Set your goals. Let it run.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="h-14 w-full rounded-none border-2 border-primary bg-primary px-10 text-base font-bold uppercase tracking-wider text-primary-foreground hover:bg-transparent hover:text-primary md:w-auto"
            >
              <ArrowRight className="h-5 w-5" />
              ENTER SYSTEM
            </Button>
          </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
