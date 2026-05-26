import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { AnimateOnView } from "~/components/core/animate-on-view";
import { ChatMockup } from "./chat-mockup";
import {
  RAYS_LEFT,
  SCATTERED_LOGOS,
  TOOL_LOGOS,
} from "~/lib/landing-assets";

const SCATTER_TIMING = [
  { delay: 0, duration: 6 },
  { delay: 0.5, duration: 7 },
  { delay: 1, duration: 5.5 },
  { delay: 1.5, duration: 6.5 },
  { delay: 0.8, duration: 7.5 },
  { delay: 0.3, duration: 5 },
  { delay: 1.2, duration: 6.8 },
  { delay: 0.7, duration: 5.8 },
  { delay: 1.8, duration: 6.2 },
  { delay: 0.4, duration: 7.2 },
  { delay: 1.1, duration: 5.3 },
  { delay: 2, duration: 6.4 },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border px-4 py-16 sm:py-20 md:px-6 md:py-32 lg:py-40">
      <Image
        src={RAYS_LEFT}
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        priority
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-auto w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 -scale-x-100 lg:block"
      />
      <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 lg:block">
        <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,_oklch(0.488_0.243_264.376_/_0.15),_transparent_70%)]" />
      </div>

      {SCATTERED_LOGOS.map((pos, i) => {
        const timing = SCATTER_TIMING[i]!;
        return (
          <div
            key={pos.slug}
            className="pointer-events-none absolute z-[7] hidden lg:block"
            style={{
              top: pos.top,
              left: pos.left,
              animation: `scatter-in 2s ease-out ${timing.delay + 0.5}s both, float-y ${timing.duration}s ease-in-out ${timing.delay + 0.5}s infinite`,
            }}
          >
            <Image
              src={`/images/logos/${pos.slug}.svg`}
              alt=""
              aria-hidden
              width={36}
              height={36}
              style={{ width: 36, height: 36 }}
            />
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 hidden lg:block lg:z-[5] lg:bg-[radial-gradient(ellipse_120%_140%_at_0%_50%,_var(--background)_40%,_transparent_100%)]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
        <AnimateOnView
          className="flex flex-1 flex-col items-center gap-5 text-center lg:items-start lg:text-left"
          duration={0.6}
        >
          <AnimateOnView
            as="h1"
            className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
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
                  className="relative h-9 w-9 rounded-full border-2 border-background bg-card p-1.5 shadow-sm sm:h-10 sm:w-10"
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
            className="max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl"
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
              className="inline-flex items-center gap-2 text-lg font-semibold text-foreground underline underline-offset-4 sm:text-xl lg:text-2xl"
            >
              <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              Deploy in seconds.
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
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
