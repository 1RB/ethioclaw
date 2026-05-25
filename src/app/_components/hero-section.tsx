import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const SCATTERED_LOGOS = [
  { slug: "gmail", top: "8%", left: "55%" },
  { slug: "github", top: "20%", left: "85%" },
  { slug: "notion", top: "70%", left: "82%" },
  { slug: "linear", top: "85%", left: "70%" },
  { slug: "slack", top: "15%", left: "70%" },
  { slug: "discord", top: "45%", left: "65%" },
  { slug: "jira", top: "60%", left: "58%" },
  { slug: "googledrive", top: "75%", left: "92%" },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b-2 border-border px-4 py-20 md:px-8 md:py-32 lg:py-40">
      {/* Background rays */}
      <Image
        src="/images/elements/rays_left.svg"
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        priority
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-auto w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 lg:block"
      />

      {/* Radial glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 lg:block">
        <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,_oklch(0.488_0.243_264.376_/_0.15),_transparent_70%)]" />
      </div>

      {/* Scattered tool logos - static, no animation */}
      {SCATTERED_LOGOS.map((pos) => (
        <div
          key={pos.slug}
          className="pointer-events-none absolute z-[7] hidden opacity-40 lg:block"
          style={{ top: pos.top, left: pos.left }}
        >
          <Image
            src={`/images/logos/${pos.slug}.svg`}
            alt=""
            aria-hidden
            width={32}
            height={32}
            style={{ width: 32, height: 32 }}
          />
        </div>
      ))}

      {/* Gradient overlay to ensure text readability */}
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_120%_140%_at_0%_50%,_var(--background)_40%,_transparent_100%)] lg:block lg:z-[5]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-12">
        {/* Left: Typography */}
        <div className="flex flex-1 flex-col items-start gap-6">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">
            AUTONOMOUS AI AGENT
          </p>

          <h1
            className="text-4xl font-bold leading-[0.9] tracking-tight text-foreground md:text-6xl lg:text-8xl"
            style={{ animation: "glitch 4s infinite" }}
          >
            YOUR AGENT
            <br />
            WORKS WHILE
            <br />
            <span className="text-primary">YOU SLEEP.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            1000+ tool integrations via OAuth. Sandboxed execution.
            Full audit trails. No plaintext passwords. No local root access.
          </p>

          <Link href="/login">
            <Button
              size="lg"
              className="h-12 w-full rounded-none border-2 border-primary bg-primary px-8 text-base font-bold uppercase tracking-wider text-primary-foreground hover:bg-transparent hover:text-primary md:w-auto"
            >
              <Zap className="h-4 w-4" />
              ENTER SYSTEM
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Right: Platform image + mockup stack */}
        <div className="relative flex flex-1 flex-col gap-4 lg:max-w-xl">
          {/* Main platform screenshot — raw brutalist frame */}
          <div className="relative border-2 border-border bg-card">
            <div className="absolute -left-2 -top-2 h-full w-full border-2 border-primary bg-primary/5" aria-hidden />
            <Image
              src="/images/platform/platform.png"
              alt="EthioClaw platform interface"
              width={744}
              height={428}
              className="relative z-10 w-full"
              priority
            />
            {/* Scanline overlay on image */}
            <div
              className="pointer-events-none absolute inset-0 z-20 opacity-[0.04]"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)",
              }}
              aria-hidden
            />
          </div>

          {/* Secondary customer screenshot — offset, inverted border */}
          <div className="relative ml-auto w-full max-w-sm border-2 border-border bg-card lg:-mt-12 lg:mr-8">
            <div className="absolute -right-2 -bottom-2 h-full w-full border-2 border-muted-foreground bg-muted/30" aria-hidden />
            <Image
              src="/images/platform/customer.png"
              alt="Customer view"
              width={744}
              height={428}
              className="relative z-10 w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 mx-auto mt-16 max-w-7xl border-t-2 border-border pt-6 md:mt-24">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "TOOLS", value: "1000+" },
            { label: "SETUP TIME", value: "<30s" },
            { label: "EXECUTION", value: "SANDBOXED" },
            { label: "UPTIME", value: "24/7" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-xl font-bold text-foreground md:text-2xl">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
