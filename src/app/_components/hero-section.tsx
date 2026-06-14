import Image from "next/image";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { AnimateOnView } from "~/components/core/animate-on-view";
import { ChatMockup } from "./chat-mockup";

const DARK_INVERT_LOGOS = new Set(["github", "linear", "notion"]);

function logoInvertClass(slug: string): string {
  return DARK_INVERT_LOGOS.has(slug) ? "invert" : "";
}

const TOOL_LOGOS = [
  "gmail",
  "github",
  "jira",
  "notion",
  "googlecalendar",
  "linear",
  "figma",
  "asana",
  "trello",
  "googledrive",
  "discord",
  "dropbox",
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32 md:px-10 md:py-40 lg:py-48">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 sm:gap-14 lg:flex-row lg:items-center lg:gap-20">
        <AnimateOnView
          className="flex flex-1 flex-col items-center gap-5 text-center lg:items-start lg:text-left"
          duration={0.6}
        >
          <AnimateOnView
            as="h1"
            className="font-serif-display text-[2rem] font-normal leading-[1.05] tracking-tight text-foreground sm:text-[2.5rem] md:text-5xl lg:text-[3.5rem]"
            delay={0.1}
          >
            Your 24/7 AI agent that actually does the work.{" "}
            <span className="italic text-primary">While you sleep.</span>
          </AnimateOnView>

          {/* Mobile: raw logo row */}
          <AnimateOnView
            className="w-full lg:hidden"
            animation="fade-in"
            delay={0.15}
          >
            <div className="flex w-full items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                {TOOL_LOGOS.map((slug) => (
                  <Image
                    key={slug}
                    src={`/images/logos/${slug}.svg`}
                    alt=""
                    aria-hidden
                    width={22}
                    height={22}
                    className={`h-[22px] w-[22px] ${logoInvertClass(slug)}`}
                    style={{ width: 22, height: 22 }}
                  />
                ))}
              </div>
            </div>
          </AnimateOnView>

          <AnimateOnView
            as="p"
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:max-w-2xl md:text-xl"
            delay={0.2}
          >
            Launch an autonomous AI agent with 1000+ integrations via{" "}
            <strong className="text-foreground">OAuth</strong> and{" "}
            <strong className="text-foreground">sandboxed execution</strong>.
            No passwords. No setup. Just results.
          </AnimateOnView>

          {/* Single primary CTA */}
          <AnimateOnView delay={0.3} className="w-full sm:w-auto">
            <Link href="/login" className="block w-full sm:inline-block">
              <Button
                size="lg"
                className="h-14 w-full px-8 text-base shadow-sm transition-transform active:scale-[0.98] sm:h-12 sm:w-auto"
              >
                <Bot className="mr-2 h-4 w-4" />
                Launch Your Agent
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </AnimateOnView>
        </AnimateOnView>

        <div className="flex w-full flex-1 justify-center lg:w-auto lg:justify-end">
          <ChatMockup />
        </div>
      </div>
    </section>
  );
}
