import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { AnimateOnView } from "~/components/core/animate-on-view";
import { ChatMockup } from "./chat-mockup";
import { TOOL_LOGOS } from "~/lib/landing-assets";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b-2 border-border px-4 py-20 sm:py-28 md:px-6 md:py-36 lg:py-44">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
        <AnimateOnView
          className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left"
          duration={0.6}
        >
          <AnimateOnView
            as="h1"
            className="font-serif-display text-4xl font-medium leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            delay={0.1}
          >
            Your AI that does things while you sleep.{" "}
            <span className="italic">Securely.</span>
          </AnimateOnView>

          <AnimateOnView
            className="flex w-full items-center justify-center overflow-x-auto py-1 lg:hidden"
            animation="fade-in"
            delay={0.15}
          >
            <div className="flex shrink-0 -space-x-2">
              {TOOL_LOGOS.map((slug) => (
                <div
                  key={slug}
                  className="relative h-9 w-9 border-2 border-background bg-card p-1.5 sm:h-10 sm:w-10"
                >
                  <Image
                    src={`/images/logos/${slug}.svg`}
                    alt=""
                    aria-hidden
                    width={24}
                    height={24}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ))}
            </div>
          </AnimateOnView>

          <AnimateOnView
            as="p"
            className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
            delay={0.2}
          >
            EthioClaw is a 24/7 AI assistant with 1000+ tools via{" "}
            <strong>OAuth</strong> and <strong>sandboxed execution</strong>.
            Built on the ideas behind OpenClaw, rebuilt from scratch for
            security.
          </AnimateOnView>

          <AnimateOnView delay={0.25}>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border-2 border-border px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Zap className="h-4 w-4" />
              Deploy in seconds
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateOnView>
        </AnimateOnView>

        <AnimateOnView
          className="flex w-full flex-1 justify-center lg:w-auto lg:justify-end"
          animation="fade-in-right"
          delay={0.3}
          duration={0.7}
        >
          <ChatMockup />
        </AnimateOnView>
      </div>
    </section>
  );
}
