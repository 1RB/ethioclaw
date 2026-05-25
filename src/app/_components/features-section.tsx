import Image from "next/image";
import { AnimateOnView } from "~/components/core/animate-on-view";

const FEATURES = [
  {
    num: "01",
    title: "OAUTH ONLY",
    desc: "No plaintext API keys. No credential leakage. Every tool connection is brokered through managed OAuth flows.",
  },
  {
    num: "02",
    title: "SANDBOXED",
    desc: "Every action runs in an isolated remote environment that evaporates when the task completes. Nothing touches your machine.",
  },
  {
    num: "03",
    title: "1000+ INTEGRATIONS",
    desc: "Gmail, GitHub, Slack, Notion, Linear, Jira, Stripe, HubSpot, Airtable, Discord, Calendar, Drive, and hundreds more.",
  },
  {
    num: "04",
    title: "24/7 EXECUTION",
    desc: "Schedule recurring tasks. Your agent runs autonomously, reports back, and remembers everything across sessions.",
  },
  {
    num: "05",
    title: "TELEGRAM NATIVE",
    desc: "Talk to your agent from anywhere. No VPNs, no port forwarding, no Docker containers on your laptop.",
  },
  {
    num: "06",
    title: "AUDIT TRAIL",
    desc: "Every tool call, every decision, every output is logged. You can reconstruct exactly what happened and when.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="relative border-b-2 border-border px-4 py-16 md:px-8 md:py-24 lg:py-32">
      <Image
        src="/images/elements/quarter_circle.svg"
        alt=""
        aria-hidden
        width={800}
        height={800}
        priority={false}
        className="pointer-events-none absolute -right-40 top-0 hidden h-[500px] w-[500px] opacity-[0.04] md:h-[700px] md:w-[700px] dark:block"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <AnimateOnView className="mb-10 md:mb-16">
          <p className="text-muted-foreground mb-4 text-xs font-bold uppercase tracking-[0.2em]">
            SPECIFICATIONS
          </p>
          <h2 className="text-foreground text-3xl font-bold leading-none tracking-tight md:text-5xl lg:text-6xl">
            CAPABILITIES
          </h2>
        </AnimateOnView>

        {/* Asymmetric feature grid with image intrusion */}
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <AnimateOnView
              key={f.num}
              className="bg-background p-6 md:p-8"
              delay={parseInt(f.num) * 0.05}
            >
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                {f.num}
              </span>
              <h3 className="mt-4 text-lg font-bold uppercase tracking-tight md:text-xl">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </AnimateOnView>
          ))}
        </div>

        {/* Large asymmetric image block */}
        <AnimateOnView className="mt-px" delay={0.2}>
          <div className="relative border-2 border-border bg-card">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/platform/customer.png"
                  alt="Customer workflow view"
                  width={744}
                  height={428}
                  className="h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)",
                  }}
                  aria-hidden
                />
              </div>
              <div className="flex flex-col justify-center border-t-2 border-border p-6 md:p-10 lg:border-t-0 lg:border-l-2">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">
                  INTERFACE
                </span>
                <h3 className="mt-4 text-2xl font-bold uppercase tracking-tight md:text-3xl">
                  BUILT FOR HUMANS.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  No YAML configs. No Dockerfiles. No API key spreadsheets.
                  Just connect your tools via OAuth and start talking to your
                  agent. The dashboard shows exactly what it is doing, when,
                  and why.
                </p>
              </div>
            </div>
          </div>
        </AnimateOnView>
      </div>
    </section>
  );
}
